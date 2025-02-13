
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

    // Create Supabase client early
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Call OpenAI API with correct model and format
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "system",
            content: "You are a cannabis plant health expert. Provide concise analysis in this format:\n1. Growth Stage:\n2. Health Score (1-10):\n3. Issues:\n4. Environment:\n5. Recommendations:"
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this cannabis plant's health and provide recommendations."
              },
              ...imageUrls.map(url => ({
                type: "image_url",
                image_url: {
                  url: url,
                  detail: "high"
                }
              }))
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const analysis = await response.json();
    const analysisText = analysis.choices[0].message.content;

    // Parse the analysis into structured data
    const sections = analysisText.split('\n').reduce((acc, line) => {
      if (line.startsWith('1. Growth Stage:')) acc.growth_stage = line.replace('1. Growth Stage:', '').trim();
      else if (line.startsWith('2. Health Score:')) acc.health_score = line.replace('2. Health Score:', '').trim();
      else if (line.startsWith('3. Issues:')) acc.specific_issues = line.replace('3. Issues:', '').trim();
      else if (line.startsWith('4. Environment:')) acc.environmental_factors = line.replace('4. Environment:', '').trim();
      else if (line.startsWith('5. Recommendations:')) {
        acc.recommendations = line.replace('5. Recommendations:', '').trim()
          .split(/(?:\r\n|\r|\n)/).filter(Boolean);
      }
      return acc;
    }, {} as any);

    const structuredAnalysis = {
      diagnosis: sections.growth_stage,
      confidence_level: 0.85,
      recommended_actions: sections.recommendations || [],
      detailed_analysis: {
        growth_stage: sections.growth_stage,
        health_score: sections.health_score,
        specific_issues: sections.specific_issues,
        environmental_factors: sections.environmental_factors,
      }
    };

    // Save analysis in background
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
    );

    return new Response(
      JSON.stringify({ success: true, analysis: structuredAnalysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-plant function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
