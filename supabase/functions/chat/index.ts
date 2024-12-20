import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message, userId } = await req.json()
    const openAiKey = Deno.env.get('OPENAI_API_KEY')
    const assistantId = Deno.env.get('OPENAI_ASSISTANT_ID')

    if (!openAiKey || !assistantId) {
      throw new Error('Missing OpenAI configuration')
    }

    console.log('Processing chat request:', { userId, messageLength: message.length })

    const openai = new OpenAI({
      apiKey: openAiKey,
    })

    // Create a thread
    const thread = await openai.beta.threads.create()
    console.log('Created thread:', thread.id)

    // Add the user's message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message,
    })
    console.log('Added user message to thread')

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
    })
    console.log('Started assistant run:', run.id)

    // Wait for the run to complete
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)
    while (runStatus.status !== "completed") {
      if (runStatus.status === "failed") {
        console.error('Assistant run failed:', runStatus)
        throw new Error("Assistant run failed")
      }
      if (runStatus.status === "requires_action") {
        console.error('Assistant requires action:', runStatus)
        throw new Error("Assistant requires action")
      }
      await new Promise(resolve => setTimeout(resolve, 1000))
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)
      console.log('Run status:', runStatus.status)
    }

    // Get the assistant's response
    const messages = await openai.beta.threads.messages.list(thread.id)
    const assistantMessage = messages.data
      .filter(msg => msg.role === "assistant")
      .pop()

    if (!assistantMessage) {
      console.error('No assistant message found in thread')
      throw new Error("No response from assistant")
    }

    const aiResponse = assistantMessage.content[0].text.value
    console.log('Got assistant response:', { responseLength: aiResponse.length })

    // Store the chat history in Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Store user message
    await supabaseClient.from('chat_history').insert([
      {
        user_id: userId,
        message: message,
        is_ai: false
      }
    ])

    // Store AI response
    await supabaseClient.from('chat_history').insert([
      {
        user_id: userId,
        message: aiResponse,
        is_ai: true
      }
    ])

    console.log('Stored chat history in database')

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in chat function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})