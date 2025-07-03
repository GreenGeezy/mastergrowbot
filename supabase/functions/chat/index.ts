
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
    console.log('Received message:', message);
    console.log('Received attachments:', attachments);

    if (!message) {
      throw new Error('No message provided');
    }

    // Filter and validate image attachments
    const imageAttachments = attachments.filter(attachment => {
      if (attachment.type && attachment.type.startsWith('image/')) {
        const url = attachment.url;
        // Check if it's a valid URL (starts with http/https)
        const isValidUrl = url && (url.startsWith('http://') || url.startsWith('https://'));
        console.log('Image attachment validation:', { url, isValidUrl });
        return isValidUrl;
      }
      return false;
    });

    console.log('Valid image attachments:', imageAttachments);

    // Prepare message content
    let messageContent = [];

    // Add text message
    messageContent.push({
      type: 'text',
      text: message
    });

    // Add image attachments if present
    for (const attachment of imageAttachments) {
      console.log('Adding image to message content:', attachment.url);
      messageContent.push({
        type: 'image_url',
        image_url: {
          url: attachment.url,
          detail: 'high' // Use high detail for better analysis
        }
      });
    }

    console.log('Final message content structure:', JSON.stringify(messageContent.map(c => ({ type: c.type, hasUrl: !!c.image_url })), null, 2));

    // Always use GPT-4o for consistency, especially when images are present
    console.log('Using GPT-4o for message processing');
    
    // Prepare system message with enhanced cannabis expertise
    const systemMessage = imageAttachments.length > 0 
      ? `You are Master Growbot, an expert cannabis cultivation specialist with advanced plant health analysis capabilities. When analyzing plant images, provide detailed observations about:

1. **Overall Plant Health**: General appearance, vigor, and growth stage
2. **Leaf Analysis**: Color, texture, spots, burns, or discoloration 
3. **Growth Patterns**: Node spacing, branching, height
4. **Environmental Stress Indicators**: Heat stress, light burn, overwatering/underwatering signs
5. **Nutrient Status**: Deficiency or toxicity symptoms
6. **Pest/Disease Detection**: Any visible insects, mold, or disease symptoms
7. **Actionable Recommendations**: Specific steps to improve plant health

Always be thorough in your image analysis and provide practical, actionable advice. If you see multiple images, analyze each one and provide comprehensive feedback.`
      : `You are Master Growbot, a cannabis cultivation expert. Provide helpful, detailed advice about growing cannabis. Be thorough in your explanations but concise enough for chat.`;

    const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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

    if (!gptResponse.ok) {
      const errorText = await gptResponse.text();
      console.error('GPT-4o request failed:', errorText);
      throw new Error(`Failed to get GPT-4o response: ${errorText}`);
    }

    const gptData = await gptResponse.json();
    console.log('GPT-4o response received');
    
    if (!gptData.choices || !gptData.choices[0] || !gptData.choices[0].message) {
      console.error('Invalid GPT response structure:', gptData);
      throw new Error('Invalid response structure from GPT-4o');
    }

    const aiResponse = gptData.choices[0].message.content;
    console.log('AI response length:', aiResponse.length);

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
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
