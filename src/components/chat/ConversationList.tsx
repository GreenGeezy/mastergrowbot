import { formatDistanceToNow } from 'date-fns'
import { MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface Conversation {
  id: string
  title: string
  lastMessage: string
  updatedAt: string
}

interface ConversationListProps {
  conversations: Conversation[]
  isLoading: boolean
  currentConversationId: string | null
  onConversationSelect: (id: string) => void
}

export function ConversationList({
  conversations,
  isLoading,
  currentConversationId,
  onConversationSelect
}: ConversationListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-2">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-gray-600">
        No conversations yet
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => (
        <Button
          key={conversation.id}
          variant="ghost"
          className={`w-full justify-start space-x-2 rounded-lg p-3 text-left hover:bg-gray-100 ${
            currentConversationId === conversation.id ? 'bg-green-100 border border-green-300' : ''
          }`}
          onClick={() => onConversationSelect(conversation.id)}
        >
          <MessageSquare className="h-4 w-4 shrink-0 text-gray-600" />
          <div className="flex-1 overflow-hidden">
            <div className="truncate font-medium text-gray-900">{conversation.title}</div>
            <div className="truncate text-xs text-gray-600">
              {conversation.lastMessage}
            </div>
          </div>
          <div className="text-xs text-gray-600">
            {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
          </div>
        </Button>
      ))}
    </div>
  )
}