
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
    const { message } = await req.json();
    console.log('Received message:', message);

    if (!message) {
      throw new Error('No message provided');
    }

    // Create a thread
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'  // Updated to v2
      }
    });

    if (!threadResponse.ok) {
      const errorText = await threadResponse.text();
      console.error('Thread creation failed:', errorText);
      throw new Error(`Failed to create thread: ${errorText}`);
    }

    const thread = await threadResponse.json();
    console.log('Thread created:', thread.id);

    // Add message to thread
    const messageResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'  // Updated to v2
      },
      body: JSON.stringify({
        role: 'user',
        content: message
      })
    });

    if (!messageResponse.ok) {
      const errorText = await messageResponse.text();
      console.error('Message creation failed:', errorText);
      throw new Error(`Failed to add message: ${errorText}`);
    }

    console.log('Message added to thread');

    // Run the assistant
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'  // Updated to v2
      },
      body: JSON.stringify({
        assistant_id: ASSISTANT_ID,
        instructions: "You are Master Growbot, a cannabis cultivation expert. Provide helpful, detailed advice about growing cannabis. Be thorough in your explanations but concise enough for chat."
      })
    });

    if (!runResponse.ok) {
      const errorText = await runResponse.text();
      console.error('Run creation failed:', errorText);
      throw new Error(`Failed to run assistant: ${errorText}`);
    }

    const run = await runResponse.json();
    console.log('Run created:', run.id);

    // Poll for completion
    let runStatus;
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      const statusResponse = await fetch(
        `https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`,
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'OpenAI-Beta': 'assistants=v2'  // Updated to v2
          }
        }
      );

      if (!statusResponse.ok) {
        const errorText = await statusResponse.text();
        console.error('Status check failed:', errorText);
        throw new Error(`Failed to check status: ${errorText}`);
      }

      const statusData = await statusResponse.json();
      runStatus = statusData.status;

      console.log(`Run status (attempt ${attempts + 1}/${maxAttempts}):`, runStatus);

      if (runStatus === 'completed') {
        break;
      } else if (runStatus === 'failed' || runStatus === 'cancelled' || runStatus === 'expired') {
        throw new Error(`Run failed with status: ${runStatus}`);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    if (runStatus !== 'completed') {
      throw new Error(`Run did not complete in time. Last status: ${runStatus}`);
    }

    // Get messages
    const messagesResponse = await fetch(
      `https://api.openai.com/v1/threads/${thread.id}/messages`,
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2'  // Updated to v2
        }
      }
    );

    if (!messagesResponse.ok) {
      const errorText = await messagesResponse.text();
      console.error('Messages retrieval failed:', errorText);
      throw new Error(`Failed to get messages: ${errorText}`);
    }

    const messages = await messagesResponse.json();
    
    // Find assistant's response (most recent assistant message)
    const assistantMessages = messages.data.filter((msg: any) => msg.role === 'assistant');
    
    if (assistantMessages.length === 0) {
      throw new Error('No assistant response found');
    }

    const latestMessage = assistantMessages[0];
    
    // Find text content in message parts
    let responseText = '';
    if (latestMessage.content && latestMessage.content.length > 0) {
      const textParts = latestMessage.content.filter((part: any) => part.type === 'text');
      if (textParts.length > 0) {
        responseText = textParts.map((part: any) => part.text.value).join('\n');
      }
    }

    if (!responseText) {
      throw new Error('No text content found in assistant response');
    }

    console.log('Assistant response:', responseText.substring(0, 100) + '...');

    return new Response(
      JSON.stringify({ response: responseText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        response: "I'm sorry, I encountered an error. Please try again." 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
