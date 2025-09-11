import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";

// Enhanced CORS headers for production and mobile support
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://www.mastergrowbot.com, https://mastergrowbot-git-ios-main-*.vercel.app, capacitor://localhost, *',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;

serve(async (req) => {
  // Handle CORS preflight with 204 status
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  try {
    // Parse request
    const { imageUrls, userId } = await req.json();
    console.log('Processing image URLs for iOS:', imageUrls);
    console.log('User ID:', userId);

    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      throw new Error('No valid image URLs provided');
    }

    // Fetch user profile data if userId is provided
    let userProfileData = null;
    if (userId) {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
      } else {
        userProfileData = profile;
        console.log('User profile data:', userProfileData);
      }
    }

    // Use OpenAI Vision API for plant analysis (iOS-optimized)
    const analysisText = await analyzeWithVision(OPENAI_API_KEY, imageUrls, userProfileData);
    
    // iOS-specific response format
    const iosResponse = {
      success: true,
      analysis: {
        summary: analysisText,
        confidence: 0.85,
        timestamp: new Date().toISOString()
      }
    };

    console.log('analyze-ios response generated');
    
    return new Response(
      JSON.stringify(iosResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-ios function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred during analysis',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Analyze plant images using OpenAI Vision API (iOS-optimized)
async function analyzeWithVision(apiKey: string, imageUrls: string[], userProfile?: any): Promise<string> {
  // iOS-optimized prompt
  let promptText = "Analyze this cannabis plant image for mobile app display. Provide a concise but thorough assessment:\n\n" +
                  "Growth Stage & Health: Brief overview\n" +
                  "Key Issues: Priority concerns if any\n" +
                  "Quick Actions: 2-3 immediate recommendations";
  
  // Add user profile context if available
  if (userProfile) {
    promptText += "\n\nUser Context:";
    
    if (userProfile.growing_method) {
      promptText += ` ${userProfile.growing_method} growing,`;
    }
    
    if (userProfile.grow_experience_level) {
      promptText += ` ${userProfile.grow_experience_level} level`;
    }
  }

  // Prepare message content with images
  const content = [
    {
      type: "text",
      text: promptText
    }
  ];

  // Add image URLs to the message
  for (const url of imageUrls) {
    content.push({
      type: "image_url",
      image_url: { url }
    });
  }

  console.log('Making OpenAI Vision API call for iOS...');
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are Master Growbot for iOS. Provide mobile-optimized cannabis plant analysis that is concise yet comprehensive. Focus on actionable insights suitable for mobile display.'
        },
        {
          role: 'user',
          content
        }
      ],
      max_tokens: 800
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('OpenAI Vision API failed:', errorBody);
    throw new Error(`OpenAI Vision API failed: ${errorBody}`);
  }

  const data = await response.json();
  const analysisText = data.choices[0].message.content;
  
  console.log('iOS Vision analysis completed');
  return analysisText;
}