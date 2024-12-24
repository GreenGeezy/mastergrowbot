import { useState, useEffect } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface Message {
  id: string
  message: string
  is_ai: boolean
  created_at: string
  conversation_id: string
}

interface Conversation {
  id: string
  title: string
  lastMessage: string
  updatedAt: string
  messages: Message[]
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const session = useSession()
  const { toast } = useToast()

  const loadConversations = async () => {
    try {
      if (!session?.user?.id) return

      const { data: messages, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: true })

      if (error) throw error

      // Group messages by conversation
      const groupedConversations = messages?.reduce((acc: { [key: string]: Message[] }, message) => {
        const conversationId = message.conversation_id || 'default'
        if (!acc[conversationId]) {
          acc[conversationId] = []
        }
        acc[conversationId].push(message)
        return acc
      }, {})

      // Format conversations for display
      const formattedConversations = Object.entries(groupedConversations || {}).map(([id, messages]) => {
        const firstUserMessage = messages.find(m => !m.is_ai)?.message || 'New Conversation'
        const lastMessage = messages[messages.length - 1]?.message || ''
        const updatedAt = messages[messages.length - 1]?.updated_at || messages[messages.length - 1]?.created_at

        return {
          id,
          title: firstUserMessage.slice(0, 50) + (firstUserMessage.length > 50 ? '...' : ''),
          lastMessage: lastMessage.slice(0, 50) + (lastMessage.length > 50 ? '...' : ''),
          updatedAt,
          messages
        }
      })

      // Sort by most recent
      formattedConversations.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )

      // Only keep last 7 days of conversations
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      const recentConversations = formattedConversations.filter(conv => 
        new Date(conv.updatedAt) > sevenDaysAgo
      )

      setConversations(recentConversations)
    } catch (error) {
      console.error('Error loading conversations:', error)
      toast({
        title: 'Error',
        description: 'Failed to load conversations',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadConversations()
  }, [session?.user?.id])

  return {
    conversations,
    isLoading,
    refreshConversations: loadConversations
  }
}
