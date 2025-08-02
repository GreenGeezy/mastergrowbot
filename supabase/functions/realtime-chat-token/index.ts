
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

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
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set')
    }

    // Get voice from request body, fallback to alloy
    const requestBody = await req.json().catch(() => ({}))
    const { voice = "alloy" } = requestBody
    
    // Validate voice is one of OpenAI's supported voices
    const validVoices = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"]
    const selectedVoice = validVoices.includes(voice) ? voice : "alloy"

    // Request an ephemeral token from OpenAI
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: selectedVoice,
        instructions: "You are Master Growbot, an AI cannabis cultivation assistant. Help users with growing advice, plant health, and answer questions clearly and accurately."
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error from OpenAI:", errorText)
      throw new Error(`Failed to get ephemeral token: ${errorText}`)
    }

    const data = await response.json()
    console.log("Session created:", data)

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error("Error:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
