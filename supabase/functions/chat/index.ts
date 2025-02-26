
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
    const { message, userId, conversationId } = await req.json();

    console.log('Creating thread for user:', userId);
    
    // Create a thread or retrieve existing one
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v1'
      }
    });

    const thread = await threadResponse.json();
    
    // Add message to thread
    await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v1'
      },
      body: JSON.stringify({
        role: 'user',
        content: message
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
    const assistantResponse = messages.data[0].content[0].text.value;

    return new Response(JSON.stringify({
      response: assistantResponse,
      threadId: thread.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in chat function:', error);
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
