import { ScrollArea } from '@/components/ui/scroll-area'
import { Leaf } from 'lucide-react'
import FeatureCard from './FeatureCard'
import { MessageCircle, Camera, BookOpen } from 'lucide-react'

interface Message {
  id: string
  message: string
  is_ai: boolean
  created_at: string
}

interface ChatMessagesProps {
  messages: Message[]
  handleQuestionClick: (question: string) => void
  starterQuestions: string[]
}

export default function ChatMessages({ messages, handleQuestionClick, starterQuestions }: ChatMessagesProps) {
  if (messages.length === 0) {
    return (
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
    )
  }

  return (
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
  )
}