import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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
    const { imageUrl } = await req.json();
    
    if (!imageUrl) {
      throw new Error('No image URL provided');
    }

    console.log('Starting analysis for image:', imageUrl);

    // Initialize OpenAI API request
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: "You are an expert cannabis cultivation advisor. Analyze plant images for health issues and provide detailed recommendations."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this cannabis plant image and provide a detailed health assessment. Include: 1) Primary health issues if any 2) Growth stage 3) Confidence level in diagnosis 4) Recommended actions"
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
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
      diagnosis: analysisText,
      confidence_level: 0.85, // Default confidence level
      recommended_actions: [],
      detailed_analysis: analysisText,
    };

    // Extract recommended actions from the text
    const actionsMatch = analysisText.match(/Recommended actions?:?\s*((?:[\s\S](?!Confidence level|Growth stage|Primary issues?))*)/i);
    if (actionsMatch) {
      structuredAnalysis.recommended_actions = actionsMatch[1]
        .split(/\d+\.|•|-/)
        .map(action => action.trim())
        .filter(action => action.length > 0);
    }

    // Extract confidence level if present
    const confidenceMatch = analysisText.match(/Confidence level:?\s*(\d+)%/i);
    if (confidenceMatch) {
      structuredAnalysis.confidence_level = parseInt(confidenceMatch[1]) / 100;
    }

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