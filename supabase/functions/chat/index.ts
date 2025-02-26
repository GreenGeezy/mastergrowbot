
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;
const ASSISTANT_ID = Deno.env.get('OPENAI_ASSISTANT_ID')!;

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
    
    console.log('Processing chat request:', { message, userId, conversationId });

    // Create a thread
    console.log('Creating thread...');
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v1'
      }
    });

    if (!threadResponse.ok) {
      const error = await threadResponse.text();
      console.error('Thread creation failed:', error);
      throw new Error('Failed to create thread');
    }

    const thread = await threadResponse.json();
    console.log('Thread created:', thread.id);

    // Add message to thread
    console.log('Adding message to thread...');
    const messageResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
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

    if (!messageResponse.ok) {
      const error = await messageResponse.text();
      console.error('Message creation failed:', error);
      throw new Error('Failed to add message');
    }

    // Run the assistant
    console.log('Running assistant...');
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v1'
      },
      body: JSON.stringify({
        assistant_id: ASSISTANT_ID,
      })
    });

    if (!runResponse.ok) {
      const error = await runResponse.text();
      console.error('Run creation failed:', error);
      throw new Error('Failed to start assistant run');
    }

    const run = await runResponse.json();
    console.log('Run created:', run.id);

    // Poll for completion
    let runStatus = await checkRunStatus(thread.id, run.id);
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds timeout

    while (runStatus.status !== 'completed' && attempts < maxAttempts) {
      if (runStatus.status === 'failed' || runStatus.status === 'expired' || runStatus.status === 'cancelled') {
        console.error('Run failed with status:', runStatus.status);
        throw new Error(`Assistant run ${runStatus.status}`);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await checkRunStatus(thread.id, run.id);
      attempts++;
      console.log(`Polling attempt ${attempts}, status: ${runStatus.status}`);
    }

    if (attempts >= maxAttempts) {
      throw new Error('Assistant response timed out');
    }

    // Get messages
    console.log('Retrieving messages...');
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v1'
      }
    });

    if (!messagesResponse.ok) {
      const error = await messagesResponse.text();
      console.error('Messages retrieval failed:', error);
      throw new Error('Failed to retrieve messages');
    }

    const messages = await messagesResponse.json();
    const assistantResponse = messages.data[0].content[0].text.value;
    console.log('Assistant response:', assistantResponse);

    return new Response(JSON.stringify({
      response: assistantResponse,
      threadId: thread.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred'
    }), {
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
  
  if (!response.ok) {
    throw new Error('Failed to check run status');
  }
  
  return await response.json();
}
