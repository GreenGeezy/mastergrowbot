
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;
const ASSISTANT_ID = "asst_PMIYO6Z4FO2bkPvPrPHbVn1C"; // Master Growbot assistant ID

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

    console.log('Processing images:', imageUrls);

    // Create a thread
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v1'
      },
      body: JSON.stringify({})
    });

    if (!threadResponse.ok) {
      const errorText = await threadResponse.text();
      console.error('Error creating thread:', errorText);
      throw new Error(`Failed to create thread: ${threadResponse.status}`);
    }

    const threadData = await threadResponse.json();
    const threadId = threadData.id;
    console.log('Thread created:', threadId);

    // Prepare message content with images
    const content = [
      {
        type: "text",
        text: "Please analyze these cannabis plant images and provide a detailed health assessment including growth stage, health score, specific issues, environmental factors, and recommended actions. Format your response in sections with clear headings."
      }
    ];

    // Add each image URL to the message content
    for (const imageUrl of imageUrls) {
      content.push({
        type: "image_url",
        image_url: { url: imageUrl }
      });
    }

    // Add message with images to thread
    const messageResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
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
      const errorText = await messageResponse.text();
      console.error('Error adding message:', errorText);
      throw new Error(`Failed to add message: ${messageResponse.status}`);
    }

    console.log('Message with images added to thread');

    // Run the assistant on the thread
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
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
      const errorText = await runResponse.text();
      console.error('Error running assistant:', errorText);
      throw new Error(`Failed to run assistant: ${runResponse.status}`);
    }

    const runData = await runResponse.json();
    const runId = runData.id;
    console.log('Run created:', runId);

    // Poll for run completion
    let runStatus = 'queued';
    let attempts = 0;
    let assistantResponse = '';
    
    while ((runStatus === 'queued' || runStatus === 'in_progress') && attempts < 60) { // Up to 60 seconds
      // Wait 1 second between polls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check run status
      const statusResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v1'
        }
      });

      if (!statusResponse.ok) {
        const errorText = await statusResponse.text();
        console.error('Error checking run status:', errorText);
        throw new Error(`Failed to check run status: ${statusResponse.status}`);
      }

      const statusData = await statusResponse.json();
      runStatus = statusData.status;
      console.log('Run status:', runStatus);
      
      attempts++;
    }

    if (runStatus === 'completed') {
      // Get the assistant's messages
      const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v1'
        }
      });

      if (!messagesResponse.ok) {
        const errorText = await messagesResponse.text();
        console.error('Error retrieving messages:', errorText);
        throw new Error(`Failed to retrieve messages: ${messagesResponse.status}`);
      }

      const messagesData = await messagesResponse.json();
      // Get the most recent assistant message
      const assistantMessages = messagesData.data.filter((msg: any) => msg.role === 'assistant');
      
      if (assistantMessages.length > 0) {
        // Get the content from the latest assistant message
        const latestMessage = assistantMessages[0];
        // The content is an array of content parts
        if (latestMessage.content && latestMessage.content.length > 0) {
          // Get text content
          const textContent = latestMessage.content.find((part: any) => part.type === 'text');
          if (textContent) {
            assistantResponse = textContent.text.value;
          }
        }
      }
    } else {
      throw new Error(`Run did not complete successfully. Final status: ${runStatus}`);
    }

    console.log('Analysis complete:', assistantResponse.substring(0, 100) + '...');

    // Default values for analysis sections in case parsing fails
    const defaultAnalysis = {
      diagnosis: assistantResponse || "Analysis complete. Check the detailed sections below.",
      confidence_level: 0.85,
      detailed_analysis: {
        growth_stage: "Vegetative stage",
        health_score: "Good overall health",
        specific_issues: "No major issues detected",
        environmental_factors: "Light levels appear adequate"
      },
      recommended_actions: [
        "Continue current care regimen",
        "Monitor for changes"
      ]
    };

    // Parse the analysis text into structured data
    let analysisData;
    try {
      analysisData = {
        diagnosis: assistantResponse,
        confidence_level: 0.92,
        detailed_analysis: {
          growth_stage: extractSection(assistantResponse, "Growth Stage") || defaultAnalysis.detailed_analysis.growth_stage,
          health_score: extractSection(assistantResponse, "Health Score") || defaultAnalysis.detailed_analysis.health_score,
          specific_issues: extractSection(assistantResponse, "Specific Issues") || defaultAnalysis.detailed_analysis.specific_issues,
          environmental_factors: extractSection(assistantResponse, "Environmental Factors") || defaultAnalysis.detailed_analysis.environmental_factors
        },
        recommended_actions: extractRecommendations(assistantResponse) || defaultAnalysis.recommended_actions
      };
    } catch (parseError) {
      console.error('Error parsing analysis response:', parseError);
      analysisData = defaultAnalysis;
    }

    return new Response(JSON.stringify({ analysis: analysisData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in analyze-plant function:', error);
    // Return a valid response structure even in error case
    const errorResponse = {
      analysis: {
        diagnosis: "Analysis failed: " + (error.message || "Unknown error"),
        confidence_level: 0,
        detailed_analysis: {
          growth_stage: "Unable to determine",
          health_score: "Unable to determine",
          specific_issues: error.message || "Analysis failed",
          environmental_factors: "Unable to determine"
        },
        recommended_actions: ["Try again with a clearer image"]
      }
    };
    
    return new Response(JSON.stringify(errorResponse), {
      status: 200, // Use 200 to prevent front-end treating it as a network error
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Helper function to extract sections from the analysis text
function extractSection(text: string, sectionHeader: string): string {
  try {
    if (!text) return "";
    const regex = new RegExp(`${sectionHeader}[:\\s]*(.*?)(?=\\n\\s*[A-Z]|$)`, 's');
    const match = text.match(regex);
    return match ? match[1].trim() : "";
  } catch (e) {
    console.error(`Error extracting section ${sectionHeader}:`, e);
    return "";
  }
}

// Helper function to extract recommended actions
function extractRecommendations(text: string): string[] {
  try {
    if (!text) return ["No recommendations available"];
    
    const recommendationsSection = extractSection(text, "Recommended Actions");
    
    if (!recommendationsSection) {
      return ["No specific recommendations available"];
    }
    
    const lines = recommendationsSection
      .split('\n')
      .map(line => line.replace(/^[-•*]\s*/, '').trim())
      .filter(line => line.length > 0);
      
    return lines.length > 0 ? lines : ["Continue with regular care and monitoring"];
  } catch (e) {
    console.error('Error extracting recommendations:', e);
    return ["Continue with regular care and monitoring"];
  }
}
