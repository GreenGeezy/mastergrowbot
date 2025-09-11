
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { 
  createCorsHeaders,
  isOriginAllowed,
  parseAnalysisResults, 
  createErrorResponse 
} from "./utils.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;

// Assistant ID with proper fallback chain
const assistantId = Deno.env.get('OPENAI_ASSISTANT_ID_WEB') ?? Deno.env.get('OPENAI_ASSISTANT_ID');

// Validate required environment variables
if (!assistantId) {
  console.error('Missing required environment variables: OPENAI_ASSISTANT_ID_WEB or OPENAI_ASSISTANT_ID');
}

serve(async (req) => {
  // Get origin from request headers
  const origin = req.headers.get('origin');
  
  // Handle CORS preflight with 204 status
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: createCorsHeaders(origin)
    });
  }

  // Validate origin for non-OPTIONS requests
  if (!isOriginAllowed(origin)) {
    console.log(`Unauthorized origin attempted access: ${origin}`);
    return new Response(
      JSON.stringify({ error: 'Unauthorized origin' }),
      { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // Early validation of required environment variables
  if (!assistantId) {
    const errorMessage = 'Server configuration error: Missing OpenAI Assistant ID';
    console.error(errorMessage);
    const headers = createCorsHeaders(origin);
    headers['Content-Type'] = 'application/json';
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers
      }
    );
  }

  try {
    // Parse request
    const { imageUrls, userId } = await req.json();
    console.log('Processing image URLs:', imageUrls);
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

    // Use OpenAI Vision API for plant analysis
    const analysisText = await analyzeWithVision(OPENAI_API_KEY, imageUrls, userProfileData);
    
    // Step 6: Parse results into structured format
    const analysisResult = parseAnalysisResults(analysisText);
    
    console.log('Parsed analysis result:', JSON.stringify(analysisResult, null, 2));

    // Schema normalizer - ensure canonical fields are returned every time
    const canonicalPayload = {
      confidence: (() => {
        const conf = analysisResult.confidence_level || analysisResult.confidence;
        return typeof conf === 'number' ? Math.min(Math.max(conf, 0), 1) : 0.7;
      })(),
      summary: analysisResult.diagnosis || analysisResult.summary || "Plant analysis completed successfully",
      growthStage: analysisResult.detailed_analysis?.growth_stage || analysisResult.growthStage || "Growth stage assessed",
      healthScore: (() => {
        const health = analysisResult.detailed_analysis?.health_score || analysisResult.healthScore;
        return typeof health === 'number' ? health : null;
      })(),
      specificIssues: (() => {
        // Convert any object/strings for issues to string array
        const issues = analysisResult.detailed_analysis?.specific_issues || analysisResult.specificIssues || analysisResult.analysis?.issues;
        if (Array.isArray(issues)) return issues.filter(i => typeof i === 'string');
        if (typeof issues === 'string') return [issues];
        return [];
      })(),
      environmentalFindings: (() => {
        const env = analysisResult.detailed_analysis?.environmental_factors || analysisResult.environmentalFindings || analysisResult.analysis?.environmental;
        if (Array.isArray(env)) return env.filter(e => typeof e === 'string');
        if (typeof env === 'string') return [env];
        return [];
      })(),
      recommendedActions: (() => {
        // Map analysis.actions or similar to recommendedActions array
        const actions = analysisResult.recommended_actions || analysisResult.recommendedActions || analysisResult.analysis?.actions;
        if (Array.isArray(actions)) return actions.filter(a => typeof a === 'string');
        if (typeof actions === 'string') return [actions];
        return [];
      })()
    };

    console.log('analyze-plant response (canonical):', Object.keys(canonicalPayload));
    
    const headers = createCorsHeaders(origin);
    headers['Content-Type'] = 'application/json';
    
    return new Response(
      JSON.stringify(canonicalPayload),
      { headers }
    );

  } catch (error) {
    // Handle any errors with a consistent response format
    console.error('Error in analyze-plant function:', error);
    return createErrorResponse(error, origin);
  }
});

// Analyze plant images using OpenAI Vision API
async function analyzeWithVision(apiKey: string, imageUrls: string[], userProfile?: any): Promise<string> {
  // Prepare base prompt text
  let promptText = "Analyze this cannabis plant image. Provide a detailed assessment in the following format:\n\n" +
                  "Growth Stage: (seedling, vegetative, flowering, etc.)\n" +
                  "Health Score: (excellent, good, fair, poor)\n" +
                  "Specific Issues: (any visible problems, deficiencies, pests, etc.)\n" +
                  "Environmental Factors: (lighting, temperature, humidity observations)\n" +
                  "Recommended Actions: (bullet points of specific actions to take)";
  
  // Add user profile context if available
  if (userProfile) {
    promptText += "\n\nUser Growing Context:";
    
    if (userProfile.growing_method) {
      promptText += `\n- Growing Method: ${userProfile.growing_method} growing`;
    }
    
    if (userProfile.grow_experience_level) {
      promptText += `\n- Experience Level: ${userProfile.grow_experience_level}`;
    }
    
    if (userProfile.monitoring_method) {
      promptText += `\n- Monitoring Method: ${userProfile.monitoring_method}`;
    }
    
    if (userProfile.nutrient_type) {
      promptText += `\n- Nutrient Type: ${userProfile.nutrient_type}`;
    }
    
    // Add note to tailor response based on profile
    promptText += "\n\nPlease tailor your analysis and recommendations specifically for this user's growing context.";
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

  console.log('Making OpenAI Vision API call...');
  
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
          content: 'You are Master Growbot, a cannabis cultivation expert. Analyze plant images thoroughly and provide specific, detailed feedback about plant health, growth stage, and potential issues. Be thorough and specific in your analysis rather than general.'
        },
        {
          role: 'user',
          content
        }
      ],
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('OpenAI Vision API failed:', errorBody);
    throw new Error(`OpenAI Vision API failed: ${errorBody}`);
  }

  const data = await response.json();
  const analysisText = data.choices[0].message.content;
  
  console.log('Vision analysis completed');
  return analysisText;
}
