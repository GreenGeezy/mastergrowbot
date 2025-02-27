
import { supabase } from '@/integrations/supabase/client'

export const sendMessageToSupabase = async (
  userId: string,
  message: string,
  conversationId: string,
  isAi: boolean = false
) => {
  return await supabase
    .from('chat_history')
    .insert([
      {
        user_id: userId,
        message: message,
        is_ai: isAi,
        conversation_id: conversationId
      }
    ])
}

export const fetchChatHistory = async (userId: string, conversationId: string) => {
  return await supabase
    .from('chat_history')
    .select('*')
    .eq('user_id', userId)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
}

export const invokeAIChat = async (
  message: string,
  userId: string,
  conversationId: string
) => {
  try {
    console.log('Invoking AI chat with:', { message, userId, conversationId });

    const response = await supabase.functions.invoke('chat', {
      body: { message, userId, conversationId }
    });

    console.log('AI response:', response);

    if (response.error) {
      throw new Error(response.error.message || 'Failed to get AI response');
    }

    if (!response.data) {
      throw new Error('No response data received from AI');
    }

    // For debugging
    console.log('Response data structure:', JSON.stringify(response.data, null, 2));

    // Check if response.data.response exists
    if (!response.data.response) {
      console.error('Invalid response structure:', response.data);
      throw new Error('Invalid response structure from AI');
    }

    return {
      data: {
        response: response.data.response
      },
      error: null
    };
  } catch (error) {
    console.error('Error in invokeAIChat:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    };
  }
}
