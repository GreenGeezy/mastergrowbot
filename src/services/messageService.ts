import { supabase } from '@/integrations/supabase/client'

export const sendMessageToSupabase = async (
  userId: string,
  message: string,
  conversationId: string,
  isAi: boolean = false
) => {
  return await supabase.from('chat_history').insert([{
    user_id: userId,
    message: message,
    is_ai: isAi,
    conversation_id: conversationId
  }])
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
  return await supabase.functions.invoke('chat', {
    body: {
      message: message.trim(),
      userId: userId,
      conversationId: conversationId
    },
  })
}