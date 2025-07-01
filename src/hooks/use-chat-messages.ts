
import { useState, useCallback, useRef, useEffect } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { useToast } from '@/hooks/use-toast'
import { sendMessageToSupabase, fetchChatHistory, invokeAIChat } from '@/services/messageService'
import { MessageCache } from '@/utils/message-cache'
import { debounce } from '@/utils/debounce'
import { isIOSPreview } from '@/utils/flags'

interface Message {
  id: string
  message: string
  is_ai: boolean
  created_at: string
  conversation_id?: string
}

export const useChatMessages = (
  currentConversationId: string | null
) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const session = useSession()
  const { toast } = useToast()
  const pendingRequests = useRef(new Set<string>())
  const isMounted = useRef(true)

  // Create mock user for iOS preview
  const getUserId = () => {
    if (isIOSPreview) {
      return 'ios-preview-user'
    }
    return session?.user?.id
  }

  // Clean up pending requests on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  // Debounced version of setMessages to reduce renders
  const debouncedSetMessages = useCallback(
    debounce((newMessages: Message[]) => {
      if (isMounted.current) {
        setMessages(newMessages)
      }
    }, 50),
    []
  )

  const loadChatHistory = useCallback(async () => {
    try {
      const userId = getUserId()
      if (!currentConversationId || !userId) return

      // In iOS preview mode, skip loading from database
      if (isIOSPreview) {
        console.log('iOS preview mode: skipping chat history load')
        return
      }

      // Check cache first
      const cachedMessages = MessageCache.get<Message[]>(
        userId,
        currentConversationId
      )

      if (cachedMessages) {
        console.log('Using cached chat history')
        setMessages(cachedMessages)
        return
      }

      // If we're already fetching this conversation, don't duplicate requests
      const requestId = `${userId}:${currentConversationId}`
      if (pendingRequests.current.has(requestId)) {
        console.log('Skipping duplicate history request')
        return
      }

      pendingRequests.current.add(requestId)
      console.log('Fetching chat history for:', currentConversationId)
      const { data, error } = await fetchChatHistory(userId, currentConversationId)

      // Remove from pending requests
      pendingRequests.current.delete(requestId)

      if (error) throw error
      
      if (data && isMounted.current) {
        // Store in cache and update state
        MessageCache.set(userId, currentConversationId, data)
        setMessages(data)
      }
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
    const userId = getUserId()
    if (!message.trim() || !userId || !currentConversationId) {
      console.log('Missing required data:', { 
        hasMessage: !!message.trim(), 
        hasUserId: !!userId, 
        hasConversationId: !!currentConversationId 
      });
      return;
    }

    setIsLoading(true)
    try {
      console.log('Sending message:', message);
      
      // Create message objects with unique IDs
      const messageId = crypto.randomUUID()
      const userMessage = {
        id: messageId,
        message: message.trim(),
        is_ai: false,
        created_at: new Date().toISOString(),
        conversation_id: currentConversationId
      }
      
      // Update UI immediately for better responsiveness
      setMessages(prev => [...prev, userMessage])
      
      // In iOS preview mode, skip database operations but still call AI
      if (!isIOSPreview) {
        // Invalidate cache
        MessageCache.invalidate(userId, currentConversationId)
        
        // Save user message to Supabase
        await sendMessageToSupabase(
          userId,
          message.trim(),
          currentConversationId
        )
      }

      // Start AI request
      console.log('Invoking AI chat...');
      const { data, error } = await invokeAIChat(
        message,
        userId,
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
        
        // Update state with AI response
        setMessages(prev => [...prev, aiMessage])
        
        // Save AI response to Supabase asynchronously (skip in iOS preview)
        if (!isIOSPreview) {
          sendMessageToSupabase(
            userId,
            data.response,
            currentConversationId,
            true
          ).catch(error => {
            console.error('Failed to save AI message:', error)
          })
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
  }, [currentConversationId, session?.user?.id, toast])

  // Effect to load chat history when conversation changes
  useEffect(() => {
    const userId = getUserId()
    if (currentConversationId && userId) {
      loadChatHistory()
    } else {
      // Clear messages when conversation ID changes to null
      setMessages([])
    }
  }, [currentConversationId, session?.user?.id, loadChatHistory])

  return {
    messages,
    setMessages,
    isLoading,
    loadChatHistory,
    sendMessage
  }
}
