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

  const handleQuestionClick = (question: string) => {
    setMessage(question)
  }

  return {
    message,
    setMessage,
    messages,
    setMessages,
    handleQuestionClick
  }
}