
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// OpenAI API functions - inline implementation to avoid import issues
async function createThread(apiKey: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/threads', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v2'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create thread: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.id;
}

async function addMessageWithImages(apiKey: string, threadId: string, imageUrls: string[], userProfile?: any): Promise<void> {
  const content = [
    {
      type: "text",
      text: `Please analyze these cannabis plant images for health issues, diseases, nutrient deficiencies, and provide specific recommendations. ${userProfile ? `User profile: ${JSON.stringify(userProfile)}` : ''}`
    },
    ...imageUrls.map(url => ({
      type: "image_url",
      image_url: { url }
    }))
  ];

  const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v2'
    },
    body: JSON.stringify({
      role: "user",
      content
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to add message: ${response.statusText}`);
  }
}

async function runAssistant(apiKey: string, threadId: string, assistantId: string, userProfile?: any): Promise<string> {
  const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v2'
    },
    body: JSON.stringify({
      assistant_id: assistantId,
      instructions: userProfile ? `Consider this user profile in your analysis: ${JSON.stringify(userProfile)}` : undefined
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to run assistant: ${response.statusText}`);
  }

  const data = await response.json();
  return data.id;
}

async function waitForRunCompletion(apiKey: string, threadId: string, runId: string): Promise<void> {
  let attempts = 0;
  const maxAttempts = 30;
  
  while (attempts < maxAttempts) {
    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to check run status: ${response.statusText}`);
    }

    const run = await response.json();
    
    if (run.status === 'completed') {
      return;
    }
    
    if (run.status === 'failed' || run.status === 'cancelled' || run.status === 'expired') {
      throw new Error(`Run ${run.status}: ${run.last_error?.message || 'Unknown error'}`);
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
    attempts++;
  }
  
  throw new Error('Assistant run timed out');
}

async function getAssistantResponse(apiKey: string, threadId: string): Promise<string> {
  const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'OpenAI-Beta': 'assistants=v2'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to get messages: ${response.statusText}`);
  }

  const data = await response.json();
  const assistantMessages = data.data.filter((msg: any) => msg.role === 'assistant');
  
  if (assistantMessages.length === 0) {
    throw new Error('No assistant response found');
  }

  const latestMessage = assistantMessages[0];
  return latestMessage.content[0]?.text?.value || 'No response content';
}
import { createClient } from "https://deno.land/x/supabase@1.0.0/mod.ts";

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

// Enhanced CORS headers with specific origin support
const enhancedCorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-requested-with, accept',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'false',
};

serve(async (req) => {
  console.log('=== ANALYZE PLANT FUNCTION START ===');
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);
  console.log('Origin:', req.headers.get('origin'));

  // Handle CORS preflight with immediate response - CRITICAL FIX
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { 
      status: 200,
      headers: enhancedCorsHeaders 
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
          headers: { ...enhancedCorsHeaders, 'Content-Type': 'application/json' } 
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
          headers: { ...enhancedCorsHeaders, 'Content-Type': 'application/json' } 
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
          headers: { ...enhancedCorsHeaders, 'Content-Type': 'application/json' } 
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

    // OpenAI Analysis with timeout protection
    try {
      console.log('Starting OpenAI analysis...');
      
      // Create thread
      const threadId = await createThread(OPENAI_API_KEY);
      console.log('Thread created:', threadId);
      
      // Add message with images
      await addMessageWithImages(OPENAI_API_KEY, threadId, imageUrls, userProfileData);
      console.log('Message added to thread');
      
      // Run assistant
      const runId = await runAssistant(OPENAI_API_KEY, threadId, ASSISTANT_ID, userProfileData);
      console.log('Assistant run started:', runId);
      
      // Wait for completion with timeout
      await waitForRunCompletion(OPENAI_API_KEY, threadId, runId);
      console.log('Run completed');
      
      // Get response
      const analysisText = await getAssistantResponse(OPENAI_API_KEY, threadId);
      console.log('Analysis text received, length:', analysisText?.length);
      
      if (!analysisText) {
        throw new Error('No analysis text received from OpenAI');
      }
      
      // Parse results
      const analysisResult = parseAnalysisResults(analysisText);
      console.log('Analysis parsed successfully');

      const totalTime = Date.now() - startTime;
      console.log('Total analysis time:', totalTime, 'ms');
      console.log('=== ANALYZE PLANT FUNCTION SUCCESS ===');

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
          headers: { ...enhancedCorsHeaders, 'Content-Type': 'application/json' } 
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
          headers: { ...enhancedCorsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error('=== ANALYZE PLANT FUNCTION ERROR ===');
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
        headers: { ...enhancedCorsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
