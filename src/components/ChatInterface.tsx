
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import ChatInput from './ChatInput'
import ChatMessages from './ChatMessages'
import { useChatState } from '@/hooks/use-chat-state'
import { ChatHeader } from './chat/ChatHeader'
import { useChatMessages } from '@/hooks/use-chat-messages'
import { useConversations } from '@/hooks/use-conversations'
import { ProfileDropdown } from './profile/ProfileDropdown'
import { ConversationList } from './chat/ConversationList'
import VoiceInterface from './VoiceInterface'

// Memoize starter questions to prevent unnecessary rerenders
const starterQuestions = [
  "What nutrients are essential during the vegetative stage?",
  "How do I identify and fix nutrient deficiencies?",
  "What's the ideal temperature and humidity for flowering?",
  "How can I prevent and treat common pests?",
  "When is the best time to harvest?"
] as const;

// Create a mutable version of the starter questions
const mutableStarterQuestions: string[] = [...starterQuestions];

export default function ChatInterface() {
  const { 
    message, 
    setMessage, 
    handleQuestionClick,
    startNewChat,
    currentConversationId 
  } = useChatState()
  
  // These states are kept for API compatibility but not used functionally
  const [isRecording, setIsRecording] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showVoiceInterface, setShowVoiceInterface] = useState(false)
  
  const session = useSession()
  
  const { conversations, isLoading: isLoadingConversations, refreshConversations } = useConversations()

  const {
    messages,
    isLoading,
    loadChatHistory,
    sendMessage
  } = useChatMessages(currentConversationId)

  // Memoize handlers to prevent unnecessary rerenders
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    
    await sendMessage(message)
    setMessage('')
    refreshConversations()
  }, [message, sendMessage, setMessage, refreshConversations])

  // Keep these methods for API compatibility
  const handleToggleRecording = useCallback(() => {
    setIsRecording(prev => !prev)
  }, [])

  const handleToggleMute = useCallback(() => {
    setIsMuted(prev => !prev)
  }, [setIsMuted])

  const handleSpeechResult = useCallback((text: string) => {
    setMessage(text)
    // Automatically submit the transcribed message
    sendMessage(text)
    refreshConversations()
  }, [setMessage, sendMessage, refreshConversations])

  const handleVoiceTranscript = useCallback((text: string) => {
    if (text.trim()) {
      sendMessage(text)
      refreshConversations()
    }
  }, [sendMessage, refreshConversations])

  const handleConversationSelect = useCallback((conversationId: string) => {
    if (currentConversationId !== conversationId) {
      setMessage('')
      startNewChat()
    }
  }, [currentConversationId, setMessage, startNewChat])

  // Load chat history when conversation changes
  useEffect(() => {
    if (session?.user?.id && currentConversationId) {
      loadChatHistory()
    }
  }, [session?.user?.id, currentConversationId, loadChatHistory])

  // Start new chat if there's no current conversation
  useEffect(() => {
    if (!currentConversationId) {
      startNewChat()
    }
  }, [currentConversationId, startNewChat])

  // Toggle voice interface
  const toggleVoiceInterface = useCallback(() => {
    setShowVoiceInterface(prev => !prev)
  }, [])

  // Memoize the sidebar content
  const sidebarContent = useMemo(() => (
    <>
      <ConversationList
        conversations={conversations}
        isLoading={isLoadingConversations}
        currentConversationId={currentConversationId}
        onConversationSelect={handleConversationSelect}
      />
      <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white hover:text-primary transition-colors">
        <ProfileDropdown />
      </div>
    </>
  ), [conversations, isLoadingConversations, currentConversationId, handleConversationSelect])

  // Memoize the main chat area content
  const chatAreaContent = useMemo(() => (
    <div className="flex flex-col flex-1 h-screen w-full bg-[#222222] border border-[#333333] overflow-hidden">
      <ChatHeader onToggleVoice={toggleVoiceInterface} showVoiceInterface={showVoiceInterface} />
      
      <ScrollArea className="flex-1 p-4">
        <ChatMessages 
          messages={messages}
          handleQuestionClick={handleQuestionClick}
          starterQuestions={mutableStarterQuestions}
        />
      </ScrollArea>
      
      {showVoiceInterface ? (
        <VoiceInterface onTranscript={handleVoiceTranscript} />
      ) : (
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
      )}
    </div>
  ), [
    messages,
    message,
    isLoading,
    isRecording,
    isMuted,
    showVoiceInterface,
    handleQuestionClick,
    toggleVoiceInterface,
    setMessage,
    handleSubmit,
    handleToggleRecording,
    handleToggleMute,
    handleSpeechResult,
    handleVoiceTranscript
  ])

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar onNewChat={startNewChat}>
          {sidebarContent}
        </AppSidebar>
        {chatAreaContent}
      </div>
    </SidebarProvider>
  )
}
