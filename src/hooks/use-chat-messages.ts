import { useState } from 'react'
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

  const loadChatHistory = async () => {
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
  }

  const sendMessage = async (message: string) => {
    if (!message.trim() || !session?.user?.id || !currentConversationId) return

    setIsLoading(true)
    try {
      const userMessage = {
        id: crypto.randomUUID(),
        message: message.trim(),
        is_ai: false,
        created_at: new Date().toISOString(),
        conversation_id: currentConversationId
      }
      
      setMessages(prev => [...prev, userMessage])
      
      await sendMessageToSupabase(
        session.user.id,
        message.trim(),
        currentConversationId
      )

      const { data, error } = await invokeAIChat(
        message,
        session.user.id,
        currentConversationId
      )

      if (error) throw error

      if (data?.response) {
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
        
        // Only speak the response if audio is explicitly enabled (not muted)
        if (!isMuted) {
          speakResponse(data.response)
        }
      }
    } catch (error: any) {
      console.error('Error sending message:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    messages,
    setMessages,
    isLoading,
    loadChatHistory,
    sendMessage
  }
}