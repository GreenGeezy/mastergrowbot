
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

// Voice maps
const uiVoices = ["alloy","echo","fable","onyx","nova","shimmer"] as const;
type UiVoice = typeof uiVoices[number];
const rtMap: Record<UiVoice,"ash"|"ballad"|"coral"|"sage"|"verse"> = {
  alloy:"ash",  echo:"ash",
  fable:"ballad", onyx:"sage", 
  nova:"coral", shimmer:"verse"
};

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

    // SAFELY read body without throwing on empty
    let voice: unknown = "echo";
    try {
      const body = await req.json();
      voice = body?.voice;
    } catch { /* leave default */ }

    const chosen: UiVoice = 
      uiVoices.includes(voice as UiVoice) ? (voice as UiVoice) : "echo";
    const realtimeVoice = rtMap[chosen];
    
    if (Deno.env.get("ENV") !== "prod") console.log("RT voice:", chosen, "→", realtimeVoice);

    // Request an ephemeral token from OpenAI
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: realtimeVoice,
        instructions: "You are Master Growbot, an AI cannabis cultivation assistant. Help users with growing advice, plant health, and answer questions clearly and accurately."
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error from OpenAI:", errorText)
      throw new Error(`Failed to get ephemeral token: ${errorText}`)
    }

    const data = await response.json()

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
