
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
    // Get user ID from auth
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: req.headers.get('Authorization')! } },
        auth: { persistSession: false },
      }
    )
    
    const { data: { user } } = await supabaseClient.auth.getUser()
    
    if (!user) {
      throw new Error('Unauthorized')
    }

    // Get settings from assistant_settings table
    const { data: settings, error: settingsError } = await supabaseClient
      .from('assistant_settings')
      .select('*')
      .or(`user_id.eq.${user.id},user_id.is.null`)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (settingsError && settingsError.code !== 'PGRST116') {
      console.error('Error fetching settings:', settingsError)
    }

    // Default settings if none exist
    const systemInstructions = settings?.system_instructions || 
      "You are Master Growbot, an AI cannabis cultivation assistant. You provide expert advice on growing cannabis, plant care, and troubleshooting issues. Be friendly, informative, and concise. Your responses should be accurate and helpful for both beginners and experienced growers."
    const temperature = settings?.temperature || 0.7
    const voice = (settings?.voice_settings as any)?.voice || "alloy"

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set')
    }

    // Request an ephemeral token from OpenAI
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice,
        instructions: systemInstructions,
        temperature,
      }),
    })

    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error.message || 'Failed to create OpenAI session')
    }
    
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

// Helper function to create Supabase client
function createClient(
  supabaseUrl: string,
  supabaseKey: string,
  options: any
) {
  return {
    auth: {
      getUser: async () => {
        const authHeader = options.global.headers.Authorization
        if (!authHeader) return { data: { user: null } }
        
        try {
          const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
            headers: {
              Authorization: authHeader,
              apikey: supabaseKey,
            },
          })
          const data = await response.json()
          return { data: { user: data } }
        } catch (error) {
          console.error('Auth error:', error)
          return { data: { user: null } }
        }
      }
    },
    from: (table: string) => ({
      select: (columns: string) => ({
        or: (filter: string) => ({
          order: (column: string, { ascending }: { ascending: boolean }) => ({
            limit: (n: number) => ({
              single: async () => {
                try {
                  const response = await fetch(
                    `${supabaseUrl}/rest/v1/${table}?select=${columns}&${filter}&order=${column}.${ascending ? 'asc' : 'desc'}&limit=${n}`,
                    {
                      headers: {
                        Authorization: options.global.headers.Authorization,
                        apikey: supabaseKey,
                        'Content-Type': 'application/json',
                      },
                    }
                  )
                  
                  if (!response.ok) {
                    throw new Error(`Supabase error: ${await response.text()}`)
                  }
                  
                  const data = await response.json()
                  return { data: data[0] || null, error: null }
                } catch (error) {
                  console.error('Database error:', error)
                  return { data: null, error }
                }
              }
            })
          })
        })
      })
    })
  }
}
