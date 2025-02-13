
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

    console.log('Received image URLs:', imageUrls);

    // Create Supabase client early
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Call OpenAI API with correct model and format
    const requestBody = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a cannabis plant health expert. Your task is to analyze plant images and provide a detailed assessment. You MUST use this EXACT format for your response:\n\n1. Growth Stage: [stage]\n2. Health Score: [1-10]\n3. Issues: [list main problems]\n4. Environment: [environmental conditions]\n5. Recommendations: [list specific actions]"
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this cannabis plant's health and provide recommendations. Follow the exact format specified."
            },
            ...imageUrls.map(url => ({
              type: "image_url",
              image_url: {
                url: url
              }
            }))
          ]
        }
      ],
      max_tokens: 1000
    };

    console.log('OpenAI request body:', JSON.stringify(requestBody));

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error response:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const analysis = await response.json();
    console.log('Raw OpenAI API response:', analysis);

    const analysisText = analysis.choices[0].message.content;
    console.log('Analysis text:', analysisText);

    // Parse the analysis into structured data with default values
    const sections = {
      growth_stage: "Not specified",
      health_score: "Not specified",
      specific_issues: "No issues detected",
      environmental_factors: "Not specified",
      recommendations: [] as string[]
    };

    const lines = analysisText.split('\n');
    console.log('Split lines:', lines);

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('1. Growth Stage:')) {
        sections.growth_stage = trimmedLine.replace('1. Growth Stage:', '').trim();
      } else if (trimmedLine.startsWith('2. Health Score:')) {
        sections.health_score = trimmedLine.replace('2. Health Score:', '').trim();
      } else if (trimmedLine.startsWith('3. Issues:')) {
        sections.specific_issues = trimmedLine.replace('3. Issues:', '').trim();
      } else if (trimmedLine.startsWith('4. Environment:')) {
        sections.environmental_factors = trimmedLine.replace('4. Environment:', '').trim();
      } else if (trimmedLine.startsWith('5. Recommendations:')) {
        const recsText = trimmedLine.replace('5. Recommendations:', '').trim();
        sections.recommendations = recsText ? recsText.split(';').map(r => r.trim()) : [];
      }
    }

    console.log('Parsed sections:', sections);

    const structuredAnalysis = {
      diagnosis: sections.growth_stage || "Analysis pending",
      confidence_level: 0.85,
      recommended_actions: sections.recommendations,
      detailed_analysis: {
        growth_stage: sections.growth_stage,
        health_score: sections.health_score,
        specific_issues: sections.specific_issues,
        environmental_factors: sections.environmental_factors,
      }
    };

    console.log('Final structured analysis:', structuredAnalysis);

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
