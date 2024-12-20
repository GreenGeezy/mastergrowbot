import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message, userId } = await req.json()
    
    if (!message || !userId) {
      throw new Error('Missing required fields: message and userId are required')
    }

    const openAiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAiKey) {
      console.error('Missing OpenAI API key')
      throw new Error('Server configuration error')
    }

    console.log('Processing chat request:', { userId, messageLength: message.length })

    const openai = new OpenAI({
      apiKey: openAiKey,
    })

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are Master Growbot, an AI cannabis cultivation expert. Your knowledge cutoff is 2023-10. Provide clear, actionable advice about cannabis growing while maintaining professionalism and focusing on legal, safe cultivation practices."
        },
        {
          role: "user",
          content: message
        }
      ],
    })

    const aiResponse = completion.choices[0].message.content
    console.log('Got assistant response:', { responseLength: aiResponse?.length })

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