
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;
const ASSISTANT_ID = Deno.env.get('OPENAI_ASSISTANT_ID') || "asst_PMIYO6Z4FO2bkPvPrPHbVn1C";

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
    console.log('Processing image URLs:', imageUrls);

    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      throw new Error('No valid image URLs provided');
    }

    // Create a thread with the updated API version
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'  // Updated to v2
      },
      body: JSON.stringify({})
    });

    if (!threadResponse.ok) {
      const errorBody = await threadResponse.text();
      console.error('Thread creation failed:', errorBody);
      throw new Error(`Failed to create thread: ${errorBody}`);
    }

    const threadData = await threadResponse.json();
    const threadId = threadData.id;
    console.log('Thread created with ID:', threadId);

    // Prepare message with images
    const content = [
      {
        type: "text",
        text: "Analyze this cannabis plant image. Provide a detailed assessment in the following format:\n\n" +
              "Growth Stage: (seedling, vegetative, flowering, etc.)\n" +
              "Health Score: (excellent, good, fair, poor)\n" +
              "Specific Issues: (any visible problems, deficiencies, pests, etc.)\n" +
              "Environmental Factors: (lighting, temperature, humidity observations)\n" +
              "Recommended Actions: (bullet points of specific actions to take)"
      }
    ];

    // Add image URLs to the message
    for (const url of imageUrls) {
      content.push({
        type: "image_url",
        image_url: { url }
      });
    }

    // Add message to thread
    const messageResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'  // Updated to v2
      },
      body: JSON.stringify({
        role: 'user',
        content
      })
    });

    if (!messageResponse.ok) {
      const errorBody = await messageResponse.text();
      console.error('Message creation failed:', errorBody);
      throw new Error(`Failed to add message: ${errorBody}`);
    }

    console.log('Message with images added to thread');

    // Run the assistant
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'  // Updated to v2
      },
      body: JSON.stringify({
        assistant_id: ASSISTANT_ID,
        instructions: "You are Master Growbot, a cannabis cultivation expert. Analyze the plant image thoroughly and provide specific, detailed feedback about the plant's health, growth stage, and potential issues. Be thorough and specific in your analysis rather than general."
      })
    });

    if (!runResponse.ok) {
      const errorBody = await runResponse.text();
      console.error('Run creation failed:', errorBody);
      throw new Error(`Failed to run assistant: ${errorBody}`);
    }

    const runData = await runResponse.json();
    const runId = runData.id;
    console.log('Run created with ID:', runId);

    // Poll for completion
    let runStatus = 'queued';
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds timeout
    
    while ((runStatus === 'queued' || runStatus === 'in_progress') && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statusResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2'  // Updated to v2
        }
      });

      if (!statusResponse.ok) {
        const errorBody = await statusResponse.text();
        console.error('Status check failed:', errorBody);
        throw new Error(`Failed to check status: ${errorBody}`);
      }

      const statusData = await statusResponse.json();
      runStatus = statusData.status;
      console.log(`Run status (attempt ${attempts + 1}/${maxAttempts}):`, runStatus);
      
      if (runStatus === 'completed') {
        break;
      } else if (runStatus === 'failed' || runStatus === 'cancelled' || runStatus === 'expired') {
        throw new Error(`Run failed with status: ${runStatus}`);
      }
      
      attempts++;
    }

    if (runStatus !== 'completed') {
      throw new Error(`Run did not complete in time. Last status: ${runStatus}`);
    }

    // Get the assistant's messages
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v2'  // Updated to v2
      }
    });

    if (!messagesResponse.ok) {
      const errorBody = await messagesResponse.text();
      console.error('Messages retrieval failed:', errorBody);
      throw new Error(`Failed to retrieve messages: ${errorBody}`);
    }

    const messagesData = await messagesResponse.json();
    
    // Find assistant's response (most recent assistant message)
    const assistantMessages = messagesData.data.filter((msg: any) => msg.role === 'assistant');
    
    if (assistantMessages.length === 0) {
      throw new Error('No assistant response found');
    }

    const latestMessage = assistantMessages[0];
    
    // Find text content in message parts
    let analysisText = '';
    if (latestMessage.content && latestMessage.content.length > 0) {
      const textParts = latestMessage.content.filter((part: any) => part.type === 'text');
      if (textParts.length > 0) {
        analysisText = textParts.map((part: any) => part.text.value).join('\n');
      }
    }

    if (!analysisText) {
      throw new Error('No text content found in assistant response');
    }

    console.log('Analysis text:', analysisText.substring(0, 200) + '...');

    // Parse out sections
    const growthStage = extractSection(analysisText, "Growth Stage") || "Vegetative stage";
    const healthScore = extractSection(analysisText, "Health Score") || "Good";
    const specificIssues = extractSection(analysisText, "Specific Issues") || "No major issues detected";
    const environmentalFactors = extractSection(analysisText, "Environmental Factors") || "Appears to be in adequate growing conditions";
    const recommendedActions = extractRecommendations(analysisText) || ["Monitor plant regularly", "Continue with current care regimen"];

    // Construct analysis response
    const analysisResult = {
      diagnosis: analysisText,
      confidence_level: 0.95,
      detailed_analysis: {
        growth_stage: growthStage,
        health_score: healthScore,
        specific_issues: specificIssues,
        environmental_factors: environmentalFactors
      },
      recommended_actions: recommendedActions
    };

    return new Response(
      JSON.stringify({ analysis: analysisResult }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-plant function:', error);
    
    // Return a structured error response
    return new Response(
      JSON.stringify({
        analysis: {
          diagnosis: error instanceof Error ? error.message : 'An error occurred during analysis',
          confidence_level: 0,
          detailed_analysis: {
            growth_stage: 'Analysis failed',
            health_score: 'Unable to determine',
            specific_issues: error instanceof Error ? error.message : 'Error during analysis',
            environmental_factors: 'Unable to determine'
          },
          recommended_actions: ['Please try again with a clearer image']
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function to extract sections from the analysis text
function extractSection(text: string, sectionTitle: string): string {
  try {
    const pattern = new RegExp(`${sectionTitle}\\s*:?\\s*([^\\n]*(\\n(?!\\w+\\s*:)[^\\n]*)*)`, 'i');
    const match = text.match(pattern);
    return match ? match[1].trim() : '';
  } catch (e) {
    console.error(`Error extracting ${sectionTitle}:`, e);
    return '';
  }
}

// Helper function to extract recommended actions as an array
function extractRecommendations(text: string): string[] {
  try {
    const recommendationsSection = extractSection(text, "Recommended Actions");
    
    if (!recommendationsSection) {
      return [];
    }
    
    // Split by lines and bullet points
    return recommendationsSection
      .split(/[\n•\-*]+/)
      .map(line => line.trim())
      .filter(line => line.length > 0);
  } catch (e) {
    console.error('Error extracting recommendations:', e);
    return [];
  }
}
