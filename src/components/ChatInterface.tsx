import { useState, useEffect } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { supabase } from '@/integrations/supabase/client'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/use-toast'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import ChatInput from './ChatInput'
import ChatMessages from './ChatMessages'
import { useChatState } from '@/hooks/use-chat-state'
import { useAudioState } from '@/hooks/use-audio-state'

interface Message {
  id: string
  message: string
  is_ai: boolean
  created_at: string
}

const starterQuestions = [
  "What nutrients are essential during the vegetative stage?",
  "How do I identify and fix nutrient deficiencies?",
  "What's the ideal temperature and humidity for flowering?",
  "How can I prevent and treat common pests?",
  "When is the best time to harvest?"
]

export default function ChatInterface() {
  const { message, setMessage, messages, setMessages, handleQuestionClick } = useChatState()
  const { isMuted, setIsMuted, speakResponse } = useAudioState()
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const session = useSession()
  const { toast } = useToast()

  useEffect(() => {
    if (session?.user?.id) {
      loadChatHistory()
    }
  }, [session?.user?.id])

  const loadChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: true })

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

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !session?.user?.id) return

    setIsLoading(true)
    try {
      // Store user message
      const userMessage = {
        id: crypto.randomUUID(),
        message: message.trim(),
        is_ai: false,
        created_at: new Date().toISOString()
      }
      
      // Update local state first
      setMessages(prev => [...prev, userMessage])
      
      // Store in Supabase
      await supabase.from('chat_history').insert([{
        user_id: session.user.id,
        message: message.trim(),
        is_ai: false
      }])

      // Get AI response
      const { data, error } = await supabase.functions.invoke('chat', {
        body: {
          message: message.trim(),
          userId: session.user.id,
        },
      })

      if (error) throw error

      if (data?.response) {
        const aiMessage = {
          id: crypto.randomUUID(),
          message: data.response,
          is_ai: true,
          created_at: new Date().toISOString()
        }
        
        // Update local state with AI response
        setMessages(prev => [...prev, aiMessage])
        
        // Store AI response in Supabase
        await supabase.from('chat_history').insert([{
          user_id: session.user.id,
          message: data.response,
          is_ai: true
        }])
        
        // Only speak if explicitly unmuted
        if (!isMuted) {
          speakResponse(data.response)
        }
      }

      setMessage('')
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

  const handleToggleRecording = () => {
    setIsRecording(!isRecording)
  }

  const handleToggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleSpeechResult = (text: string) => {
    setMessage(text)
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 h-screen w-full bg-[#222222] border border-[#333333] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-[#333333] bg-[#1A1A1A]">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/a72be8e9-0fb6-49e8-985d-127ba951fee7.png" 
                alt="Master Growbot Logo" 
                className="w-10 h-10 rounded-full"
              />
              <h1 className="text-xl font-semibold text-white">Master Growbot</h1>
            </div>
          </div>

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
            onSubmit={sendMessage}
            onToggleRecording={handleToggleRecording}
            onToggleMute={handleToggleMute}
            onSpeechResult={handleSpeechResult}
          />
        </div>
      </div>
    </SidebarProvider>
  )
}