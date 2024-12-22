import { useState, useEffect } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import ChatInput from './ChatInput'
import ChatMessages from './ChatMessages'
import { useChatState } from '@/hooks/use-chat-state'
import { useAudioState } from '@/hooks/use-audio-state'
import { ChatHeader } from './chat/ChatHeader'
import { useChatMessages } from '@/hooks/use-chat-messages'

const starterQuestions = [
  "What nutrients are essential during the vegetative stage?",
  "How do I identify and fix nutrient deficiencies?",
  "What's the ideal temperature and humidity for flowering?",
  "How can I prevent and treat common pests?",
  "When is the best time to harvest?"
]

export default function ChatInterface() {
  const { 
    message, 
    setMessage, 
    handleQuestionClick,
    startNewChat,
    currentConversationId 
  } = useChatState()
  const { isMuted, setIsMuted, speakResponse } = useAudioState()
  const [isRecording, setIsRecording] = useState(false)
  const session = useSession()

  const {
    messages,
    isLoading,
    loadChatHistory,
    sendMessage
  } = useChatMessages(currentConversationId, speakResponse, isMuted)

  useEffect(() => {
    if (session?.user?.id) {
      loadChatHistory()
    }
  }, [session?.user?.id, currentConversationId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    
    await sendMessage(message)
    setMessage('')
  }

  const handleToggleRecording = () => {
    setIsRecording(!isRecording)
  }

  const handleToggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleSpeechResult = (text: string) => {
    setMessage(text)
  }

  // Start a new chat if there's no current conversation
  useEffect(() => {
    if (!currentConversationId) {
      startNewChat()
    }
  }, [currentConversationId])

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar onNewChat={startNewChat} />
        <div className="flex flex-col flex-1 h-screen w-full bg-[#222222] border border-[#333333] overflow-hidden">
          <ChatHeader />
          
          <ScrollArea className="flex-1 p-4">
            <ChatMessages 
              messages={messages}
              handleQuestionClick={handleQuestionClick}
              starterQuestions={starterQuestions}
            />
          </ScrollArea>
          
          <ChatInput
            message={message}
            isLoading={isLoading}
            isRecording={isRecording}
            isMuted={isMuted}
            onMessageChange={(e) => setMessage(e.target.value)}
            onSubmit={handleSubmit}
            onToggleRecording={handleToggleRecording}
            onToggleMute={handleToggleMute}
            onSpeechResult={handleSpeechResult}
          />
        </div>
      </div>
    </SidebarProvider>
  )
}