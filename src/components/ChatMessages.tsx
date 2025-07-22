
import { ScrollArea } from '@/components/ui/scroll-area'
import { Leaf, Paperclip } from 'lucide-react'
import FeatureCard from './FeatureCard'
import { MessageCircle, Camera, BookOpen } from 'lucide-react'

interface Message {
  id: string
  message: string
  is_ai: boolean
  created_at: string
  attachments?: any[]
}

interface ChatMessagesProps {
  messages: Message[]
  handleQuestionClick: (question: string) => void
  starterQuestions: string[]
}

export default function ChatMessages({ messages, handleQuestionClick, starterQuestions }: ChatMessagesProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center glow-effect mb-4">
          <Leaf className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-headline-sm font-display text-foreground mb-2">How can I help you today?</h2>
        <p className="text-gray-600 max-w-md mb-6">
          I'm your cannabis cultivation assistant. Ask me anything about growing, plant care, or troubleshooting issues.
        </p>
        
        <div className="flex gap-2 w-full max-w-4xl justify-center mb-8">
          <FeatureCard
            icon={MessageCircle}
            title="Growing Assistant"
            subtitle="Get expert growing advice"
            to="/chat"
          />
          <FeatureCard
            icon={Camera}
            title="Plant Health Check"
            subtitle="Diagnose plant issues"
            to="/plant-health"
          />
          <FeatureCard
            icon={BookOpen}
            title="Growing Guide"
            subtitle="Quick answers to FAQs"
            to="/grow-guide"
          />
        </div>

        <div className="w-full max-w-2xl">
          <h3 className="text-gray-900 text-left mb-2 font-medium">Common Questions</h3>
          <div className="grid grid-cols-1 gap-2">
            {starterQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuestionClick(question)}
                className="cyber-button text-left p-3 rounded-lg text-gray-600 hover:text-gray-900 text-sm transition-all duration-200"
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
          <div className={`flex items-start gap-3 max-w-[80%] ${msg.is_ai ? 'flex-row' : 'flex-row-reverse'}`}>
            {/* Avatar for AI messages */}
            {msg.is_ai && (
              <div className="flex-shrink-0 mt-1">
                <img
                  src="/lovable-uploads/a151dde4-1cfb-4488-a036-e547a4e8c941.png"
                  alt="Master Growbot"
                  className="w-8 h-8 rounded-full"
                />
              </div>
            )}
            
            <div
              className={`p-4 rounded-2xl ${
                msg.is_ai
                  ? 'bg-gray-50 hover:bg-gray-100 border border-gray-200 shimmer'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {/* Show attachments if present */}
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="mb-3 space-y-2">
                  {msg.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm opacity-80">
                      {attachment.type && attachment.type.startsWith('image/') ? (
                        <div className="space-y-2">
                          <img 
                            src={attachment.url} 
                            alt={attachment.filename}
                            className="max-w-full h-auto rounded-lg max-h-64 object-contain"
                          />
                          <div className="flex items-center gap-1 text-xs">
                            <Paperclip className="w-3 h-3" />
                            <span>{attachment.filename}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Paperclip className="w-3 h-3" />
                          <span>{attachment.filename}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="whitespace-pre-wrap">
                {msg.message}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
