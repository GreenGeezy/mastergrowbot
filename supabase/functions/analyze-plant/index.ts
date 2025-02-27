
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;
const ASSISTANT_ID = "asst_PMIYO6Z4FO2bkPvPrPHbVn1C";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrls } = await req.json();
    console.log('Received request with image URLs:', imageUrls);

    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      throw new Error('No valid image URLs provided');
    }

    // Create a thread
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v1'
      }
    });

    if (!threadResponse.ok) {
      console.error('Thread creation failed:', await threadResponse.text());
      throw new Error('Failed to create thread');
    }

    const thread = await threadResponse.json();
    console.log('Thread created:', thread.id);

    // Prepare the message with images
    const content = [
      {
        type: "text",
        text: "Please analyze these plant images for health issues and provide recommendations."
      }
    ];

    for (const url of imageUrls) {
      content.push({
        type: "image_url",
        image_url: {
          url: url
        }
      });
    }

    // Add message to thread
    const messageResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v1'
      },
      body: JSON.stringify({
        role: 'user',
        content
      })
    });

    if (!messageResponse.ok) {
      console.error('Message creation failed:', await messageResponse.text());
      throw new Error('Failed to add message to thread');
    }

    console.log('Message added to thread');

    // Run the assistant
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v1'
      },
      body: JSON.stringify({
        assistant_id: ASSISTANT_ID
      })
    });

    if (!runResponse.ok) {
      console.error('Run creation failed:', await runResponse.text());
      throw new Error('Failed to start analysis');
    }

    const run = await runResponse.json();
    console.log('Run created:', run.id);

    // Poll for completion
    let runStatus;
    let attempts = 0;
    const maxAttempts = 60; // 60 seconds timeout

    while (attempts < maxAttempts) {
      const statusResponse = await fetch(
        `https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`,
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'OpenAI-Beta': 'assistants=v1'
          }
        }
      );

      if (!statusResponse.ok) {
        throw new Error('Failed to check analysis status');
      }

      const statusData = await statusResponse.json();
      runStatus = statusData.status;
      console.log('Run status:', runStatus);

      if (runStatus === 'completed') {
        break;
      } else if (runStatus === 'failed' || runStatus === 'cancelled') {
        throw new Error(`Analysis failed with status: ${runStatus}`);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    if (runStatus !== 'completed') {
      throw new Error('Analysis timed out');
    }

    // Get the analysis results
    const messagesResponse = await fetch(
      `https://api.openai.com/v1/threads/${thread.id}/messages`,
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v1'
        }
      }
    );

    if (!messagesResponse.ok) {
      throw new Error('Failed to retrieve analysis results');
    }

    const messages = await messagesResponse.json();
    const assistantMessage = messages.data.find((msg: any) => msg.role === 'assistant');

    if (!assistantMessage || !assistantMessage.content[0]?.text?.value) {
      throw new Error('No valid analysis results found');
    }

    const analysis = assistantMessage.content[0].text.value;
    console.log('Analysis received:', analysis.substring(0, 100) + '...');

    // Format the response
    const formattedAnalysis = {
      diagnosis: analysis,
      confidence_level: 0.95,
      detailed_analysis: {
        growth_stage: extractSection(analysis, "Growth Stage"),
        health_score: extractSection(analysis, "Health Score"),
        specific_issues: extractSection(analysis, "Issues"),
        environmental_factors: extractSection(analysis, "Environmental Factors")
      },
      recommended_actions: extractRecommendations(analysis)
    };

    return new Response(
      JSON.stringify({ analysis: formattedAnalysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-plant function:', error);
    return new Response(
      JSON.stringify({
        analysis: {
          diagnosis: error instanceof Error ? error.message : 'An error occurred during analysis',
          confidence_level: 0,
          detailed_analysis: {
            growth_stage: 'Analysis failed',
            health_score: 'Unable to determine',
            specific_issues: 'Error during analysis',
            environmental_factors: 'Unable to determine'
          },
          recommended_actions: ['Please try again with a clear image']
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function extractSection(text: string, sectionTitle: string): string {
  try {
    const regex = new RegExp(`${sectionTitle}[:\\s]*(.*?)(?=\\n\\s*[A-Z]|$)`, 's');
    const match = text.match(regex);
    return match ? match[1].trim() : `No ${sectionTitle.toLowerCase()} information available`;
  } catch (e) {
    return `Could not extract ${sectionTitle.toLowerCase()} information`;
  }
}

function extractRecommendations(text: string): string[] {
  try {
    const recommendationsSection = text.match(/Recommendations?[:\\s]*(.*?)(?=\\n\\s*[A-Z]|$)/s);
    if (!recommendationsSection) {
      return ['No specific recommendations available'];
    }

    return recommendationsSection[1]
      .split('\n')
      .map(line => line.replace(/^[-•*]\s*/, '').trim())
      .filter(line => line.length > 0);
  } catch (e) {
    return ['Error extracting recommendations'];
  }
}
