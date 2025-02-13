
import { ScrollArea } from '@/components/ui/scroll-area'
import { Leaf } from 'lucide-react'
import FeatureCard from './FeatureCard'
import { MessageCircle, Camera, BookOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Message {
  id: string
  message: string
  is_ai: boolean
  created_at: string
}

interface ChatMessagesProps {
  messages: Message[]
  handleQuestionClick: (question: string) => void
  starterQuestions: readonly string[]
}

export default function ChatMessages({ messages, handleQuestionClick, starterQuestions }: ChatMessagesProps) {
  const navigate = useNavigate()

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center glow-effect mb-4">
          <Leaf className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-semibold text-white mb-2">How can I help you today?</h2>
        <p className="text-gray-400 max-w-md mb-6">
          I'm your cannabis cultivation assistant. Ask me anything about growing, plant care, or troubleshooting issues.
        </p>
        
        <div className="flex gap-2 w-full max-w-4xl justify-center mb-8">
          <FeatureCard
            icon={MessageCircle}
            title="Growing Assistant"
            subtitle="Get expert growing advice"
            onClick={() => navigate('/chat')}
          />
          <FeatureCard
            icon={Camera}
            title="Plant Health Check"
            subtitle="Diagnose plant issues"
            onClick={() => navigate('/plant-health')}
          />
          <FeatureCard
            icon={BookOpen}
            title="Growing Guide"
            subtitle="Quick answers to FAQs"
            onClick={() => navigate('/grow-guide')}
          />
        </div>

        <div className="w-full max-w-2xl">
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
                ? 'bg-card hover:bg-card-hover border border-accent/20 shimmer'
                : 'bg-gradient-primary hover:bg-gradient-secondary'
            }`}
          >
            {msg.message}
          </div>
        </div>
      ))}
    </div>
  )
}
