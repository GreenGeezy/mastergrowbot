
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

// Initialize Supabase client
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

  try {
    console.log('Analyze plant function called');
    
    // Parse request
    const body = await req.json();
    const { imageUrls, userId } = body;
    
    console.log('Request body:', { imageUrlsCount: imageUrls?.length, userId });

    // Validate required parameters
    if (!OPENAI_API_KEY) {
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      console.error('No valid image URLs provided');
      throw new Error('No valid image URLs provided');
    }

    if (!userId) {
      console.error('User ID not provided');
      throw new Error('Authentication required - please sign in');
    }

    console.log('Processing image URLs:', imageUrls);

    // Fetch user profile data if userId is provided
    let userProfileData = null;
    try {
      console.log('Fetching user profile for:', userId);
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
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

    // Step 1: Create a thread
    console.log('Creating OpenAI thread...');
    const threadId = await createThread(OPENAI_API_KEY);
    console.log('Thread created:', threadId);
    
    // Step 2: Add message with images to thread and include user profile context
    console.log('Adding message with images to thread...');
    await addMessageWithImages(OPENAI_API_KEY, threadId, imageUrls, userProfileData);
    console.log('Message added to thread');
    
    // Step 3: Run assistant on thread with user-specific instructions
    console.log('Running assistant...');
    const runId = await runAssistant(OPENAI_API_KEY, threadId, ASSISTANT_ID, userProfileData);
    console.log('Assistant run started:', runId);
    
    // Step 4: Wait for run completion (with exponential backoff)
    console.log('Waiting for run completion...');
    await waitForRunCompletion(OPENAI_API_KEY, threadId, runId);
    console.log('Run completed');
    
    // Step 5: Get assistant response
    console.log('Getting assistant response...');
    const analysisText = await getAssistantResponse(OPENAI_API_KEY, threadId);
    console.log('Analysis text received, length:', analysisText?.length);
    
    if (!analysisText) {
      throw new Error('No analysis text received from OpenAI');
    }
    
    // Step 6: Parse results into structured format
    const analysisResult = parseAnalysisResults(analysisText);
    console.log('Analysis parsed successfully');

    // Return successful response
    const response = { 
      analysis: analysisResult, 
      diagnosis: analysisText,
      profileUsed: !!userProfileData,
      success: true
    };

    console.log('Returning successful response');
    return new Response(
      JSON.stringify(response),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in analyze-plant function:', error);
    
    // Create detailed error response
    const errorResponse = {
      error: error.message || 'Unknown error occurred',
      success: false,
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
