
import { supabase } from '@/integrations/supabase/client'

// Cache for conversation history
const chatHistoryCache = new Map<string, any>()

export const sendMessageToSupabase = async (
  userId: string,
  message: string,
  conversationId: string,
  isAi: boolean = false
) => {
  const response = await supabase.from('chat_history').insert([{
    user_id: userId,
    message: message,
    is_ai: isAi,
    conversation_id: conversationId
  }])

  // Update cache if successful
  if (!response.error && conversationId) {
    const cachedHistory = chatHistoryCache.get(conversationId) || []
    chatHistoryCache.set(conversationId, [...cachedHistory, {
      user_id: userId,
      message: message,
      is_ai: isAi,
      conversation_id: conversationId,
      created_at: new Date().toISOString()
    }])
  }

  return response
}

export const fetchChatHistory = async (userId: string, conversationId: string) => {
  // Check cache first
  if (chatHistoryCache.has(conversationId)) {
    return { data: chatHistoryCache.get(conversationId), error: null }
  }

  const response = await supabase
    .from('chat_history')
    .select('*')
    .eq('user_id', userId)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  // Update cache if successful
  if (!response.error && response.data) {
    chatHistoryCache.set(conversationId, response.data)
  }

  return response
}

export const invokeAIChat = async (
  message: string,
  userId: string,
  conversationId: string
) => {
  try {
    console.log('Invoking AI chat with message:', message);
    
    const response = await supabase.functions.invoke('chat', {
      body: {
        message: message.trim(),
        userId: userId,
        conversationId: conversationId
      },
    });

    console.log('AI response:', response);

    if (response.error) {
      throw new Error(`Chat function error: ${response.error.message}`);
    }

    return response;
  } catch (error) {
    console.error('Error in invokeAIChat:', error);
    throw error;
  }
}
