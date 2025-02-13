
import { useState } from 'react'

interface Message {
  id: string
  message: string
  is_ai: boolean
  created_at: string
}

export function useChatState() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)

  const handleQuestionClick = (question: string) => {
    setMessage(question)
  }

  const startNewChat = () => {
    setMessages([])
    setCurrentConversationId(crypto.randomUUID())
    setMessage('')
  }

  return {
    message,
    setMessage,
    messages,
    setMessages,
    handleQuestionClick,
    startNewChat,
    currentConversationId
  }
}
