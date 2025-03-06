
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

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;
const ASSISTANT_ID = Deno.env.get('OPENAI_ASSISTANT_ID') || "asst_PMIYO6Z4FO2bkPvPrPHbVn1C";

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request
    const { imageUrls } = await req.json();
    console.log('Processing image URLs:', imageUrls);

    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      throw new Error('No valid image URLs provided');
    }

    // Step 1: Create a thread
    const threadId = await createThread(OPENAI_API_KEY);
    
    // Step 2: Add message with images to thread
    await addMessageWithImages(OPENAI_API_KEY, threadId, imageUrls);
    
    // Step 3: Run assistant on thread
    const runId = await runAssistant(OPENAI_API_KEY, threadId, ASSISTANT_ID);
    
    // Step 4: Wait for run completion (with exponential backoff)
    await waitForRunCompletion(OPENAI_API_KEY, threadId, runId);
    
    // Step 5: Get assistant response
    const analysisText = await getAssistantResponse(OPENAI_API_KEY, threadId);
    
    // Step 6: Parse results into structured format
    const analysisResult = parseAnalysisResults(analysisText);

    // Return successful response
    return new Response(
      JSON.stringify({ analysis: analysisResult }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    // Handle any errors with a consistent response format
    return createErrorResponse(error);
  }
});
