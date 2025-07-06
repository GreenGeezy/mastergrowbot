
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { 
  createThread, 
  addMessageWithImages, 
  runAssistant, 
  waitForRunCompletion, 
  getAssistantResponse 
} from "./openai-client.ts";
import { 
  corsHeaders, 
  parseAnalysisResults, 
  createErrorResponse 
} from "./utils.ts";
import { createClient } from "https://deno.land/x/supabase@1.0.0/mod.ts";

// Initialize Supabase client with service role for admin access
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;
const ASSISTANT_ID = Deno.env.get('OPENAI_ASSISTANT_ID') || "asst_PMIYO6Z4FO2bkPvPrPHbVn1C";

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  console.log('=== ANALYZE PLANT FUNCTION START ===');
  console.log('Request method:', req.method);
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));
  
  try {
    // Parse request with better error handling
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body', success: false }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { imageUrls, userId } = body;
    
    console.log('Parsed request:', { 
      imageUrlsCount: imageUrls?.length, 
      userId: userId || 'not provided',
      timestamp: new Date().toISOString()
    });

    // Validate required parameters
    if (!OPENAI_API_KEY) {
      console.error('OpenAI API key not configured');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured', success: false }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      console.error('No valid image URLs provided');
      return new Response(
        JSON.stringify({ error: 'No valid image URLs provided', success: false }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing image URLs:', imageUrls);

    // Fetch user profile data if userId is provided and not anonymous
    let userProfileData = null;
    if (userId && userId !== 'anonymous' && !userId.startsWith('anonymous-')) {
      try {
        console.log('Fetching user profile for:', userId);
        const profileStartTime = Date.now();
        
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        console.log('Profile fetch took:', Date.now() - profileStartTime, 'ms');
        
        if (error) {
          console.log('No user profile found or error fetching profile:', error.message);
        } else {
          userProfileData = profile;
          console.log('User profile data loaded successfully');
        }
      } catch (profileError) {
        console.log('Error fetching user profile:', profileError);
        // Continue without profile data
      }
    } else {
      console.log('Anonymous user or no userId provided, proceeding without profile data');
    }

    // Step 1: Create a thread
    console.log('Creating OpenAI thread...');
    const threadStartTime = Date.now();
    const threadId = await createThread(OPENAI_API_KEY);
    console.log('Thread created:', threadId, 'took:', Date.now() - threadStartTime, 'ms');
    
    // Step 2: Add message with images to thread and include user profile context
    console.log('Adding message with images to thread...');
    const messageStartTime = Date.now();
    await addMessageWithImages(OPENAI_API_KEY, threadId, imageUrls, userProfileData);
    console.log('Message added to thread, took:', Date.now() - messageStartTime, 'ms');
    
    // Step 3: Run assistant on thread with user-specific instructions
    console.log('Running assistant...');
    const runStartTime = Date.now();
    const runId = await runAssistant(OPENAI_API_KEY, threadId, ASSISTANT_ID, userProfileData);
    console.log('Assistant run started:', runId, 'took:', Date.now() - runStartTime, 'ms');
    
    // Step 4: Wait for run completion (with exponential backoff and timeout)
    console.log('Waiting for run completion...');
    const completionStartTime = Date.now();
    
    // Set a hard timeout for the entire OpenAI process
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('OpenAI analysis timed out after 60 seconds'));
      }, 60000); // 60 second timeout
    });
    
    const completionPromise = waitForRunCompletion(OPENAI_API_KEY, threadId, runId);
    
    await Promise.race([completionPromise, timeoutPromise]);
    console.log('Run completed, took:', Date.now() - completionStartTime, 'ms');
    
    // Step 5: Get assistant response
    console.log('Getting assistant response...');
    const responseStartTime = Date.now();
    const analysisText = await getAssistantResponse(OPENAI_API_KEY, threadId);
    console.log('Analysis text received, length:', analysisText?.length, 'took:', Date.now() - responseStartTime, 'ms');
    
    if (!analysisText) {
      throw new Error('No analysis text received from OpenAI');
    }
    
    // Step 6: Parse results into structured format
    const analysisResult = parseAnalysisResults(analysisText);
    console.log('Analysis parsed successfully');

    const totalTime = Date.now() - startTime;
    console.log('Total analysis time:', totalTime, 'ms');
    console.log('=== ANALYZE PLANT FUNCTION SUCCESS ===');

    // Return successful response
    const response = { 
      analysis: analysisResult, 
      diagnosis: analysisText,
      profileUsed: !!userProfileData,
      processingTime: totalTime,
      success: true
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error('=== ANALYZE PLANT FUNCTION ERROR ===');
    console.error('Error in analyze-plant function:', error);
    console.error('Error occurred after:', totalTime, 'ms');
    console.error('Error stack:', error.stack);
    
    // Create detailed error response
    const errorResponse = {
      error: error.message || 'Unknown error occurred',
      success: false,
      processingTime: totalTime,
      timestamp: new Date().toISOString()
    };

    return new Response(
      JSON.stringify(errorResponse),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
