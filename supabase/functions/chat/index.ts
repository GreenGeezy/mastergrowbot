
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { OpenAI } from "https://deno.land/x/openai@v4.24.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message, userId, conversationId } = await req.json()

    if (!message) {
      throw new Error('Message is required')
    }

    if (!userId) {
      throw new Error('User ID is required')
    }

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })

    // Create Supabase client outside the completion to start processing in parallel
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Start the OpenAI API call
    const completionPromise = openai.chat.completions.create({
      model: "gpt-4o-mini", // Using the faster mini model
      messages: [
        {
          role: "system",
          content: "You are Master Growbot, an AI cannabis cultivation expert. Provide clear, direct advice without using markdown formatting. Focus on being helpful and accurate while maintaining a friendly, professional tone. Keep responses concise but informative."
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
      presence_penalty: 0.6, // Added to encourage more focused responses
      frequency_penalty: 0.5, // Added to reduce repetition
    })

    // Start saving the user message to the database in parallel
    const userMessagePromise = supabaseClient
      .from('chat_history')
      .insert([{
        user_id: userId,
        message: message,
        is_ai: false,
        conversation_id: conversationId
      }])

    // Wait for OpenAI response
    const completion = await completionPromise
    const response = completion.choices[0].message.content

    // Use waitUntil for background task to avoid blocking the response
    EdgeRuntime.waitUntil(
      Promise.all([
        // Save AI response to chat history
        supabaseClient
          .from('chat_history')
          .insert([{
            user_id: userId,
            message: response,
            is_ai: true,
            conversation_id: conversationId
          }]),
        // Ensure user message was saved
        userMessagePromise
      ]).catch(error => {
        console.error('Background task error:', error)
      })
    )

    // Return the response immediately without waiting for database operations
    return new Response(
      JSON.stringify({ response }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
