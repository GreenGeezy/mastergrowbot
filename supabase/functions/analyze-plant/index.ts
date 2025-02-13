
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

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // First create a thread
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v1'
      }
    });

    if (!threadResponse.ok) {
      throw new Error('Failed to create thread');
    }

    const thread = await threadResponse.json();
    console.log('Created thread:', thread);

    // Add a message to the thread with the image
    const messageResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v1'
      },
      body: JSON.stringify({
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Analyze this cannabis plant\'s health and provide recommendations.'
          },
          ...imageUrls.map(url => ({
            type: 'image_url',
            image_url: { url }
          }))
        ]
      })
    });

    if (!messageResponse.ok) {
      throw new Error('Failed to add message to thread');
    }

    console.log('Added message to thread');

    // Run the assistant
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v1'
      },
      body: JSON.stringify({
        assistant_id: Deno.env.get('OPENAI_ASSISTANT_ID'),
      })
    });

    if (!runResponse.ok) {
      throw new Error('Failed to start run');
    }

    const run = await runResponse.json();
    console.log('Started run:', run);

    // Poll for completion
    let runStatus;
    let attempts = 0;
    const maxAttempts = 30;
    
    while (attempts < maxAttempts) {
      const statusResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'OpenAI-Beta': 'assistants=v1'
        }
      });

      if (!statusResponse.ok) {
        throw new Error('Failed to check run status');
      }

      runStatus = await statusResponse.json();
      console.log('Run status:', runStatus.status);

      if (runStatus.status === 'completed') {
        break;
      } else if (runStatus.status === 'failed') {
        throw new Error('Run failed');
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new Error('Analysis timed out');
    }

    // Get the messages
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'OpenAI-Beta': 'assistants=v1'
      }
    });

    if (!messagesResponse.ok) {
      throw new Error('Failed to get messages');
    }

    const messages = await messagesResponse.json();
    console.log('Messages:', messages);

    // Get the assistant's response
    const assistantMessage = messages.data.find(m => m.role === 'assistant');
    if (!assistantMessage) {
      throw new Error('No assistant response found');
    }

    const analysisText = assistantMessage.content[0].text.value;
    console.log('Analysis text:', analysisText);

    // Parse the analysis into structured data
    const sections = {
      growth_stage: "Not specified",
      health_score: "Not specified",
      specific_issues: "No issues detected",
      environmental_factors: "Not specified",
      recommendations: [] as string[]
    };

    const lines = analysisText.split('\n');
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
