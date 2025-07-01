
import { useState, useCallback } from 'react'
import { isIOSPreview } from '@/utils/flags'

export const useChatState = () => {
  const [message, setMessage] = useState('')
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(() => {
    // Always create a conversation ID for iOS preview mode
    if (isIOSPreview) {
      return crypto.randomUUID()
    }
    return null
  })

  const handleQuestionClick = useCallback((question: string) => {
    setMessage(question)
  }, [])

  const startNewChat = useCallback(() => {
    const newConversationId = crypto.randomUUID()
    setCurrentConversationId(newConversationId)
    setMessage('')
  }, [])

  // Ensure we always have a conversation ID
  const ensureConversationId = useCallback(() => {
    if (!currentConversationId) {
      const newId = crypto.randomUUID()
      setCurrentConversationId(newId)
      return newId
    }
    return currentConversationId
  }, [currentConversationId])

  return {
    message,
    setMessage,
    handleQuestionClick,
    startNewChat,
    currentConversationId: currentConversationId || ensureConversationId(),
    ensureConversationId
  }
}
