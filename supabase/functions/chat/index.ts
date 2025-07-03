
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;
const ASSISTANT_ID = Deno.env.get('OPENAI_ASSISTANT_ID') || "asst_PMIYO6Z4FO2bkPvPrPHbVn1C";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, attachments = [] } = await req.json();
    console.log('Chat function received message:', message);
    console.log('Chat function received attachments:', attachments);

    if (!message) {
      throw new Error('No message provided');
    }

    // Filter and validate image attachments with detailed logging
    const imageAttachments = attachments.filter(attachment => {
      console.log('Checking attachment:', attachment);
      
      if (attachment.type && attachment.type.startsWith('image/')) {
        const url = attachment.url;
        console.log('Found image attachment with URL:', url);
        
        // Check if it's a valid URL (starts with http/https)
        const isValidUrl = url && (url.startsWith('http://') || url.startsWith('https://'));
        console.log('Image URL validation result:', { url, isValidUrl });
        
        if (!isValidUrl) {
          console.error('Invalid image URL rejected:', url);
        }
        
        return isValidUrl;
      }
      return false;
    });

    console.log('Valid image attachments after filtering:', imageAttachments);

    // Prepare message content array
    let messageContent = [];

    // Add text message
    messageContent.push({
      type: 'text',
      text: message
    });

    // Add image attachments if present
    if (imageAttachments.length > 0) {
      console.log('Adding image attachments to message content');
      for (const attachment of imageAttachments) {
        console.log('Adding image to message:', attachment.url);
        messageContent.push({
          type: 'image_url',
          image_url: {
            url: attachment.url,
            detail: 'high' // Use high detail for better plant analysis
          }
        });
      }
    } else {
      console.log('No valid image attachments found');
    }

    console.log('Final message content structure:', JSON.stringify(messageContent.map(c => ({ 
      type: c.type, 
      hasUrl: !!c.image_url,
      urlPreview: c.image_url ? c.image_url.url.substring(0, 50) + '...' : null
    })), null, 2));

    // Always use GPT-4o for consistency, especially when images are present
    console.log('Using GPT-4o for message processing');
    
    // Enhanced system message for cannabis expertise with image analysis capabilities
    const systemMessage = imageAttachments.length > 0 
      ? `You are Master Growbot, an expert cannabis cultivation specialist with advanced plant health analysis capabilities. You can analyze plant images provided by users.

When analyzing plant images, provide detailed observations about:

1. **Overall Plant Health**: General appearance, vigor, and growth stage
2. **Leaf Analysis**: Color, texture, spots, burns, yellowing, or discoloration patterns
3. **Growth Patterns**: Node spacing, branching, overall plant structure
4. **Environmental Stress Indicators**: Heat stress, light burn, overwatering/underwatering signs
5. **Nutrient Status**: Deficiency or toxicity symptoms (nitrogen, phosphorus, potassium, calcium, magnesium, etc.)
6. **Pest/Disease Detection**: Any visible insects, mold, powdery mildew, or disease symptoms
7. **Growth Stage Assessment**: Vegetative, pre-flower, flower, or harvest readiness
8. **Actionable Recommendations**: Specific, immediate steps to improve plant health

Always start your response by acknowledging that you can see and analyze the image(s) provided, then give your detailed analysis with practical, actionable advice. Be thorough but concise enough for chat format.`
      : `You are Master Growbot, a cannabis cultivation expert. Provide helpful, detailed advice about growing cannabis. Be thorough in your explanations but concise enough for chat format.`;

    console.log('Making request to OpenAI with', imageAttachments.length, 'images');

    const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Always use GPT-4o for image analysis
        messages: [
          {
            role: 'system',
            content: systemMessage
          },
          {
            role: 'user',
            content: messageContent
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    console.log('OpenAI response status:', gptResponse.status);

    if (!gptResponse.ok) {
      const errorText = await gptResponse.text();
      console.error('OpenAI request failed:', errorText);
      throw new Error(`Failed to get OpenAI response: ${gptResponse.status} - ${errorText}`);
    }

    const gptData = await gptResponse.json();
    console.log('OpenAI response received successfully');
    
    if (!gptData.choices || !gptData.choices[0] || !gptData.choices[0].message) {
      console.error('Invalid OpenAI response structure:', gptData);
      throw new Error('Invalid response structure from OpenAI');
    }

    const aiResponse = gptData.choices[0].message.content;
    console.log('AI response generated, length:', aiResponse.length);

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        response: "I'm sorry, I encountered an error processing your request. Please try again." 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
