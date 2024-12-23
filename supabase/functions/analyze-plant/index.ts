import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageUrl } = await req.json()
    
    if (!imageUrl) {
      throw new Error('No image URL provided')
    }

    // Initialize OpenAI API client
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o",
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
                image_url: imageUrl
              }
            ]
          }
        ],
        max_tokens: 1000
      })
    })

    if (!openaiResponse.ok) {
      const error = await openaiResponse.json()
      console.error('OpenAI API Error:', error)
      throw new Error('Failed to analyze image')
    }

    const analysis = await openaiResponse.json()
    const analysisText = analysis.choices[0].message.content

    // Parse the analysis text to extract structured data
    const structuredAnalysis = parseAnalysisResponse(analysisText)

    // Create Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Store analysis results
    const { data: analysisRecord, error: dbError } = await supabaseAdmin
      .from('plant_analyses')
      .insert({
        image_url: imageUrl,
        growth_stage: structuredAnalysis.growthStage,
        primary_issue: structuredAnalysis.primaryIssue,
        confidence_level: structuredAnalysis.confidenceLevel,
        diagnosis: analysisText,
        recommended_actions: structuredAnalysis.recommendedActions,
        detailed_analysis: structuredAnalysis
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database Error:', dbError)
      throw new Error('Failed to save analysis results')
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: analysisRecord 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in analyze-plant function:', error)
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
    )
  }
})

function parseAnalysisResponse(text: string) {
  // Initialize default structure
  const analysis = {
    primaryIssue: null,
    growthStage: null,
    confidenceLevel: 0,
    recommendedActions: [],
    detailedAnalysis: text
  }

  try {
    // Extract growth stage
    const growthStageMatch = text.match(/Growth stage:?\s*([^\.]+)/i)
    if (growthStageMatch) {
      analysis.growthStage = growthStageMatch[1].trim()
    }

    // Extract primary issue
    const issueMatch = text.match(/Primary (?:health )?issues?:?\s*([^\.]+)/i)
    if (issueMatch) {
      analysis.primaryIssue = issueMatch[1].trim()
    }

    // Extract confidence level
    const confidenceMatch = text.match(/Confidence level:?\s*(\d+)%/i)
    if (confidenceMatch) {
      analysis.confidenceLevel = parseInt(confidenceMatch[1]) / 100
    }

    // Extract recommended actions
    const actionsMatch = text.match(/Recommended actions?:?\s*((?:[\s\S](?!Confidence level|Growth stage|Primary issues?))*)/i)
    if (actionsMatch) {
      analysis.recommendedActions = actionsMatch[1]
        .split(/\d+\.|•|-/)
        .map(action => action.trim())
        .filter(action => action.length > 0)
    }

  } catch (error) {
    console.error('Error parsing analysis:', error)
  }

  return analysis
}