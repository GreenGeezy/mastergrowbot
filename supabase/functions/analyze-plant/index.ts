
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

    // Step 1: Create a thread
    const threadId = await createThread(OPENAI_API_KEY);
    
    // Step 2: Add message with images to thread and include user profile context
    await addMessageWithImages(OPENAI_API_KEY, threadId, imageUrls, userProfileData);
    
    // Step 3: Run assistant on thread with user-specific instructions
    const runId = await runAssistant(OPENAI_API_KEY, threadId, ASSISTANT_ID, userProfileData);
    
    // Step 4: Wait for run completion (with exponential backoff)
    await waitForRunCompletion(OPENAI_API_KEY, threadId, runId);
    
    // Step 5: Get assistant response
    const analysisText = await getAssistantResponse(OPENAI_API_KEY, threadId);
    
    // Step 6: Parse results into structured format
    const analysisResult = parseAnalysisResults(analysisText);

    // Return successful response
    return new Response(
      JSON.stringify({ analysis: analysisResult, profileUsed: !!userProfileData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    // Handle any errors with a consistent response format
    return createErrorResponse(error);
  }
});
