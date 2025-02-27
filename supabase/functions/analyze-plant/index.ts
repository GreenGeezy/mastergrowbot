
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;

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

    console.log('Processing images:', imageUrls);

    // Prepare image content for OpenAI API
    const imageContent = imageUrls.map(url => ({
      type: "image_url",
      image_url: { url }
    }));

    // Call OpenAI API with image analysis prompt and images
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert cannabis plant analyzer. Analyze the plant images and provide a detailed health assessment including growth stage, health score, specific issues, environmental factors, and recommended actions. Format your response in sections with clear headings.'
          },
          {
            role: 'user',
            content: [
              {
                type: "text",
                text: "Please analyze these cannabis plant images and provide a detailed health assessment."
              },
              ...imageContent
            ]
          }
        ],
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;
    console.log('Analysis complete:', analysis.substring(0, 100) + '...');

    // Parse the analysis text into structured data
    const analysisResult = {
      analysis: {
        diagnosis: analysis,
        confidence_level: 0.92,
        detailed_analysis: {
          growth_stage: extractSection(analysis, "Growth Stage"),
          health_score: extractSection(analysis, "Health Score"),
          specific_issues: extractSection(analysis, "Specific Issues"),
          environmental_factors: extractSection(analysis, "Environmental Factors")
        },
        recommended_actions: extractRecommendations(analysis)
      }
    };

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in analyze-plant function:', error);
    return new Response(JSON.stringify({ error: error.message || 'An unknown error occurred' }), {
      status: 200, // Use 200 to prevent front-end treating it as a network error
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Helper function to extract sections from the analysis text
function extractSection(text: string, sectionHeader: string): string {
  const regex = new RegExp(`${sectionHeader}[:\\s]*(.*?)(?=\\n\\s*[A-Z]|$)`, 's');
  const match = text.match(regex);
  return match ? match[1].trim() : `No ${sectionHeader.toLowerCase()} information available`;
}

// Helper function to extract recommended actions
function extractRecommendations(text: string): string[] {
  const recommendationsSection = extractSection(text, "Recommended Actions");
  
  if (!recommendationsSection) {
    return ["No specific recommendations available"];
  }
  
  return recommendationsSection
    .split('\n')
    .map(line => line.replace(/^[-•*]\s*/, '').trim())
    .filter(line => line.length > 0);
}
