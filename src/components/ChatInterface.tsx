import { useState, useEffect } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/use-toast'
import { Leaf, Send, MessageCircle, Camera, BookOpen } from 'lucide-react'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import FeatureCard from './FeatureCard'

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
];

export default function ChatInterface() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
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
      const response = await fetch('/functions/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          message,
          userId: session?.user?.id,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setMessage('')
      await loadChatHistory()
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuestionClick = (question: string) => {
    setMessage(question);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 h-screen w-full bg-[#222222] border border-[#333333] overflow-hidden">
          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center glow-effect">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-white">How can I help you today?</h2>
                <p className="text-gray-400 max-w-md">
                  I'm your cannabis cultivation assistant. Ask me anything about growing, plant care, or troubleshooting issues.
                </p>
                
                <div className="grid grid-cols-1 gap-3 w-full max-w-2xl">
                  <FeatureCard
                    icon={MessageCircle}
                    title="Growing Assistant"
                    subtitle="Get expert growing advice"
                    onClick={() => handleQuestionClick("Can you help me optimize my growing setup?")}
                  />
                  <FeatureCard
                    icon={Camera}
                    title="Plant Health Check"
                    subtitle="Diagnose plant issues"
                    onClick={() => handleQuestionClick("How can I identify common plant health issues?")}
                  />
                  <FeatureCard
                    icon={BookOpen}
                    title="Growing Guide"
                    subtitle="Quick answers to FAQs"
                    onClick={() => handleQuestionClick("What are the essential steps for successful cannabis cultivation?")}
                  />
                </div>

                <div className="w-full max-w-2xl mt-2">
                  <h3 className="text-white text-left mb-2 font-medium">Common Questions</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {starterQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuestionClick(question)}
                        className="cyber-button text-left p-3 rounded-lg text-gray-300 hover:text-white text-sm transition-all duration-200"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.is_ai ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        msg.is_ai
                          ? 'message-bubble-ai'
                          : 'message-bubble-user'
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          
          <div className="p-4 bg-[#1A1A1A] border-t border-[#333333]">
            <form onSubmit={sendMessage} className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about cannabis cultivation..."
                disabled={isLoading}
                className="bg-[#333333] border-[#444444] text-white placeholder:text-gray-400 focus:border-accent focus:ring-accent"
              />
              <Button 
                type="submit" 
                disabled={isLoading}
                className="cyber-button"
              >
                {isLoading ? (
                  <div className="loading-pulse">Sending...</div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}