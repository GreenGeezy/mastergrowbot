
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrls } = await req.json();
    
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      throw new Error('No image URLs provided');
    }

    // Create Supabase client early to start processing in parallel
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Start the OpenAI API call
    const openaiPromise = fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert cannabis cultivation advisor specializing in plant health diagnostics. 
            Analyze multiple images of cannabis plants and provide detailed, actionable feedback in the following format:
            1. Growth Stage Assessment: Identify if the plant is in seedling, vegetative, or flowering stage
            2. Overall Health Score: Rate the plant's health on a scale of 1-10
            3. Specific Issues: List any visible problems (nutrient deficiencies, pest damage, etc.)
            4. Environmental Factors: Comment on any visible environmental stress indicators
            5. Detailed Recommendations: Provide specific, actionable steps to improve plant health`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze these cannabis plant images and provide a comprehensive health assessment following the format specified."
              },
              ...imageUrls.map(url => ({
                type: "image_url",
                image_url: { url }
              }))
            ]
          }
        ],
        max_tokens: 1000
      })
    });

    // Wait for OpenAI response
    const response = await openaiPromise;
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const analysis = await response.json();
    const analysisText = analysis.choices[0].message.content;

    // Parse and structure the analysis
    const structuredAnalysis = {
      diagnosis: extractSection(analysisText, "Growth Stage Assessment", "Overall Health Score"),
      confidence_level: 0.85,
      recommended_actions: extractRecommendations(analysisText),
      detailed_analysis: {
        growth_stage: extractSection(analysisText, "Growth Stage Assessment", "Overall Health Score"),
        health_score: extractSection(analysisText, "Overall Health Score", "Specific Issues"),
        specific_issues: extractSection(analysisText, "Specific Issues", "Environmental Factors"),
        environmental_factors: extractSection(analysisText, "Environmental Factors", "Detailed Recommendations"),
      }
    };

    // Save analysis in background without blocking response
    EdgeRuntime.waitUntil(
      supabaseClient
        .from('plant_analyses')
        .insert({
          user_id: req.headers.get('x-user-id'),
          image_url: imageUrls[0],
          image_urls: imageUrls,
          diagnosis: structuredAnalysis.diagnosis,
          confidence_level: structuredAnalysis.confidence_level,
          detailed_analysis: structuredAnalysis.detailed_analysis,
          recommended_actions: structuredAnalysis.recommended_actions,
        })
        .then(({ error }) => {
          if (error) console.error('Error saving analysis:', error);
        })
    );

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: structuredAnalysis 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-plant function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Helper functions stay the same
function extractSection(text: string, startMarker: string, endMarker: string): string {
  const startIndex = text.indexOf(startMarker);
  const endIndex = text.indexOf(endMarker);
  if (startIndex === -1) return "";
  const start = startIndex + startMarker.length;
  const end = endIndex === -1 ? undefined : endIndex;
  return text.slice(start, end).trim();
}

function extractRecommendations(text: string): string[] {
  const recommendationsSection = extractSection(text, "Detailed Recommendations", "END");
  return recommendationsSection
    .split(/\d+\.|•|-/)
    .map(item => item.trim())
    .filter(item => item.length > 0);
}
