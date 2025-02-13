import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrls } = await req.json();
    
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      throw new Error('No image URLs provided');
    }

    console.log('Starting analysis for images:', imageUrls);

    // Create a combined prompt that includes all images
    const messages = [
      {
        role: "system",
        content: `You are an expert cannabis cultivation advisor specializing in plant health diagnostics. 
        Analyze multiple images of cannabis plants and provide detailed, actionable feedback in the following format:
        1. Growth Stage Assessment: Identify if the plant is in seedling, vegetative, or flowering stage
        2. Overall Health Score: Rate the plant's health on a scale of 1-10
        3. Specific Issues: List any visible problems (nutrient deficiencies, pest damage, etc.)
        4. Environmental Factors: Comment on any visible environmental stress indicators
        5. Detailed Recommendations: Provide specific, actionable steps to improve plant health
        Be specific and technical but explain terms when needed.`
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Analyze these cannabis plant images and provide a comprehensive health assessment following the format specified. Consider all angles and details shown in the images."
          },
          ...imageUrls.map(url => ({
            type: "image_url",
            image_url: { url }
          }))
        ]
      }
    ];

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 1000
      })
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('OpenAI API Error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const analysis = await openaiResponse.json();
    console.log('OpenAI Analysis received:', analysis);

    if (!analysis.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI');
    }

    const analysisText = analysis.choices[0].message.content;

    // Parse the analysis text to extract structured data
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

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: structuredAnalysis 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
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
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

// Helper function to extract sections from the analysis text
function extractSection(text: string, startMarker: string, endMarker: string): string {
  const startIndex = text.indexOf(startMarker);
  const endIndex = text.indexOf(endMarker);
  
  if (startIndex === -1) return "";
  
  const start = startIndex + startMarker.length;
  const end = endIndex === -1 ? undefined : endIndex;
  
  return text.slice(start, end).trim();
}

// Helper function to extract recommendations from the analysis text
function extractRecommendations(text: string): string[] {
  const recommendationsSection = extractSection(text, "Detailed Recommendations", "END");
  return recommendationsSection
    .split(/\d+\.|•|-/)
    .map(item => item.trim())
    .filter(item => item.length > 0);
}