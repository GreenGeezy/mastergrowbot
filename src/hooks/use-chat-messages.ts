
import { useState, useCallback } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { useToast } from '@/hooks/use-toast'
import { sendMessageToSupabase, fetchChatHistory, invokeAIChat } from '@/services/messageService'

interface Message {
  id: string
  message: string
  is_ai: boolean
  created_at: string
  conversation_id?: string
}

export const useChatMessages = (
  currentConversationId: string | null,
  speakResponse: (text: string) => void,
  isMuted: boolean
) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const session = useSession()
  const { toast } = useToast()

  const loadChatHistory = useCallback(async () => {
    try {
      if (!currentConversationId || !session?.user?.id) return

      const { data, error } = await fetchChatHistory(session.user.id, currentConversationId)

      if (error) throw error
      if (data) setMessages(data)
    } catch (error) {
      console.error('Error loading chat history:', error)
      toast({
        title: 'Error',
        description: 'Failed to load chat history',
        variant: 'destructive',
      })
    }
  }, [currentConversationId, session?.user?.id, toast])

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || !session?.user?.id || !currentConversationId) {
      console.log('Missing required data:', { 
        hasMessage: !!message.trim(), 
        hasUserId: !!session?.user?.id, 
        hasConversationId: !!currentConversationId 
      });
      return;
    }

    setIsLoading(true)
    try {
      console.log('Sending message:', message);
      
      // Add user message to UI immediately
      const userMessage = {
        id: crypto.randomUUID(),
        message: message.trim(),
        is_ai: false,
        created_at: new Date().toISOString(),
        conversation_id: currentConversationId
      }
      
      setMessages(prev => [...prev, userMessage])
      
      // Save user message to Supabase
      await sendMessageToSupabase(
        session.user.id,
        message.trim(),
        currentConversationId
      )

      // Get AI response
      console.log('Invoking AI chat...');
      const { data, error } = await invokeAIChat(
        message,
        session.user.id,
        currentConversationId
      )

      if (error) {
        console.error('AI chat error:', error);
        throw error;
      }

      if (data?.response) {
        console.log('Received AI response:', data.response);
        
        const aiMessage = {
          id: crypto.randomUUID(),
          message: data.response,
          is_ai: true,
          created_at: new Date().toISOString(),
          conversation_id: currentConversationId
        }
        
        setMessages(prev => [...prev, aiMessage])
        
        await sendMessageToSupabase(
          session.user.id,
          data.response,
          currentConversationId,
          true
        )
        
        if (!isMuted) {
          speakResponse(data.response)
        }
      } else {
        console.error('No response data from AI');
        throw new Error('No response received from AI');
      }
    } catch (error: any) {
      console.error('Error in sendMessage:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [currentConversationId, session?.user?.id, isMuted, speakResponse, toast])

  return {
    messages,
    setMessages,
    isLoading,
    loadChatHistory,
    sendMessage
  }
}
