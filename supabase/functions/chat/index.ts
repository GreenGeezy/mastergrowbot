import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

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

    // Create OpenAI API client
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are Master Growbot, an AI cannabis cultivation assistant. You provide expert guidance on growing cannabis, focusing on best practices, troubleshooting, and optimization. Keep responses clear, practical, and focused on legal cultivation methods.'
          },
          {
            role: 'user',
            content: message
          }
        ],
      }),
    })

    const data = await response.json()
    const aiResponse = data.choices[0].message.content

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

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})