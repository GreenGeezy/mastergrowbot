
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const ASSISTANT_ID = 'asst_PMlYO6Z4FO2bkPvPrPHbVn1C';

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
    
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      throw new Error('No image URLs provided');
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

    const thread = await threadResponse.json();

    // Prepare the message with images
    const imageContent = imageUrls.map(url => ({
      type: "image_url",
      image_url: { url }
    }));

    // Add message with images to thread
    await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v1'
      },
      body: JSON.stringify({
        role: 'user',
        content: [
          {
            type: "text",
            text: "Please analyze these cannabis plant images and provide a detailed health assessment."
          },
          ...imageContent
        ]
      })
    });

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

    const run = await runResponse.json();

    // Poll for completion
    let runStatus = await checkRunStatus(thread.id, run.id);
    while (runStatus.status !== 'completed') {
      if (runStatus.status === 'failed') {
        throw new Error('Assistant run failed');
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await checkRunStatus(thread.id, run.id);
    }

    // Get messages
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v1'
      }
    });

    const messages = await messagesResponse.json();
    const analysis = messages.data[0].content[0].text.value;

    // Parse the analysis into the expected format
    const analysisResult = {
      analysis: {
        diagnosis: analysis,
        confidence_level: 0.95,
        detailed_analysis: {
          growth_stage: extractSection(analysis, "Growth Stage:"),
          health_score: extractSection(analysis, "Health Score:"),
          specific_issues: extractSection(analysis, "Specific Issues:"),
          environmental_factors: extractSection(analysis, "Environmental Factors:")
        },
        recommended_actions: extractRecommendations(analysis)
      }
    };

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in analyze-plant function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function checkRunStatus(threadId: string, runId: string) {
  const response = await fetch(
    `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
    {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v1'
      }
    }
  );
  return await response.json();
}

function extractSection(text: string, sectionHeader: string): string {
  const startIndex = text.indexOf(sectionHeader);
  if (startIndex === -1) return "";
  
  const nextSection = text.indexOf("\n\n", startIndex);
  return text
    .slice(startIndex + sectionHeader.length, nextSection === -1 ? undefined : nextSection)
    .trim();
}

function extractRecommendations(text: string): string[] {
  const recommendationsSection = extractSection(text, "Recommended Actions:");
  return recommendationsSection
    .split('\n')
    .map(item => item.replace(/^[•\-]\s*/, '').trim())
    .filter(item => item.length > 0);
}
