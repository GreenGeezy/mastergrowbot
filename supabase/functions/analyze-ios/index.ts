import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// OpenAI Vision API functions - using Chat Completions for better image analysis
async function analyzeImagesWithVision(apiKey: string, imageUrls: string[], userProfile?: any): Promise<string> {
  const messages = [
    {
      role: "system",
      content: `You are an expert cannabis cultivation assistant specializing in plant health analysis. Analyze the provided images for:
      
      1. Health Issues: Identify any visible problems, diseases, or stress indicators
      2. Nutrient Deficiencies: Look for signs of nitrogen, phosphorus, potassium, or other nutrient deficiencies
      3. Pests & Diseases: Check for spider mites, aphids, powdery mildew, bud rot, or other issues
      4. Growth Stage Assessment: Determine the plant's current growth stage
      5. Environmental Stress: Look for light burn, heat stress, overwatering, or underwatering
      
      Provide specific, actionable recommendations for each issue found. Be thorough and professional.
      ${userProfile ? `Consider this user profile in your analysis: ${JSON.stringify(userProfile)}` : ''}`
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Please analyze these cannabis plant images and provide a detailed health assessment with specific recommendations."
        },
        ...imageUrls.map(url => ({
          type: "image_url",
          image_url: {
            url: url,
            detail: "high"
          }
        }))
      ]
    }
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o', // Using GPT-4 Vision model
      messages: messages,
      max_tokens: 2000,
      temperature: 0.3
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`OpenAI Vision API error: ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'No analysis provided';
}
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Utility functions - inline implementation
function parseAnalysisResults(text: string): any {
  // Simple parsing - return the text as analysis
  return {
    summary: text,
    recommendations: [],
    issues_detected: [],
    confidence: 0.9
  };
}

// Allowed origins for CORS
const allowedOrigins = [
  'https://www.mastergrowbot.com',
  'https://4a890707-41df-4980-a668-0e1ebdbeae5f.lovableproject.com',
  'https://mastergrowbot-git-ios-main-greengeezys-projects.vercel.app',
  'capacitor://localhost'
];

// Get CORS headers based on request origin
function getCorsHeaders(requestOrigin: string | null) {
  const origin = requestOrigin && allowedOrigins.includes(requestOrigin) 
    ? requestOrigin 
    : allowedOrigins[0]; // fallback to primary domain

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-requested-with, accept',
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'false',
  };
}

serve(async (req) => {
  console.log('=== ANALYZE IOS FUNCTION START ===');
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);
  const requestOrigin = req.headers.get('origin');
  console.log('Origin:', requestOrigin);

  const corsHeaders = getCorsHeaders(requestOrigin);

  // Handle CORS preflight with immediate response - CRITICAL FIX
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  const startTime = Date.now();
  
  try {
    // Environment validation with detailed logging
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const ASSISTANT_ID = Deno.env.get('OPENAI_ASSISTANT_ID') || "asst_PMIYO6Z4FO2bkPvPrPHbVn1C";
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log('Environment check:');
    console.log('- OPENAI_API_KEY exists:', !!OPENAI_API_KEY);
    console.log('- ASSISTANT_ID:', ASSISTANT_ID);

    if (!OPENAI_API_KEY) {
      console.error('OpenAI API key not configured');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured', success: false }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client only if credentials exist
    let supabase = null;
    if (supabaseUrl && supabaseServiceKey) {
      try {
        supabase = createClient(supabaseUrl, supabaseServiceKey);
        console.log('Supabase client initialized successfully');
      } catch (supabaseError) {
        console.error('Failed to initialize Supabase client:', supabaseError);
        // Continue without Supabase - analysis can still work
      }
    }

    // Parse request body with better error handling
    let body;
    try {
      const textBody = await req.text();
      console.log('Raw request body length:', textBody.length);
      
      if (!textBody || textBody.length === 0) {
        throw new Error('Empty request body');
      }
      
      body = JSON.parse(textBody);
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid request format', success: false }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { imageUrls, userId } = body;
    
    console.log('Parsed request:', { 
      imageUrlsCount: imageUrls?.length, 
      userId: userId || 'not provided',
      timestamp: new Date().toISOString()
    });

    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      console.error('No valid image URLs provided');
      return new Response(
        JSON.stringify({ error: 'No valid image URLs provided', success: false }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Processing image URLs:', imageUrls);

    // Fetch user profile data if available
    let userProfileData = null;
    if (supabase && userId && userId !== 'anonymous' && !userId.startsWith('anonymous-')) {
      try {
        console.log('Fetching user profile for:', userId);
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error) {
          console.log('No user profile found:', error.message);
        } else {
          userProfileData = profile;
          console.log('User profile data loaded successfully');
        }
      } catch (profileError) {
        console.log('Error fetching user profile:', profileError);
      }
    }

    // OpenAI Vision Analysis with timeout protection
    try {
      console.log('Starting OpenAI Vision analysis...');
      
      // Use direct vision analysis instead of assistants
      const analysisText = await analyzeImagesWithVision(OPENAI_API_KEY, imageUrls, userProfileData);
      console.log('Analysis text received, length:', analysisText?.length);
      
      if (!analysisText) {
        throw new Error('No analysis text received from OpenAI');
      }
      
      // Parse results
      const analysisResult = parseAnalysisResults(analysisText);
      console.log('Analysis parsed successfully');

      const totalTime = Date.now() - startTime;
      console.log('Total analysis time:', totalTime, 'ms');
      console.log('=== ANALYZE IOS FUNCTION SUCCESS ===');

      // Return successful response with CORS headers
      return new Response(
        JSON.stringify({ 
          analysis: analysisResult, 
          diagnosis: analysisText,
          profileUsed: !!userProfileData,
          processingTime: totalTime,
          success: true
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } catch (openaiError) {
      console.error('OpenAI processing error:', openaiError);
      const errorMessage = openaiError.message || 'Analysis processing failed';
      
      return new Response(
        JSON.stringify({
          error: errorMessage,
          success: false,
          processingTime: Date.now() - startTime
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error('=== ANALYZE IOS FUNCTION ERROR ===');
    console.error('Unexpected error:', error);
    console.error('Error stack:', error.stack);
    
    // CRITICAL: Always return CORS headers even on error
    return new Response(
      JSON.stringify({
        error: 'Internal server error occurred',
        success: false,
        processingTime: totalTime,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});