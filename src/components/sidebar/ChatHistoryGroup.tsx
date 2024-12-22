import { MessageSquare } from 'lucide-react'
import {
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'

interface ChatHistory {
  id: string
  message: string
  created_at: string
  is_ai: boolean
  conversation_id: string
}

interface ChatHistoryGroupProps {
  label: string
  chats: ChatHistory[]
}

export function ChatHistoryGroup({ label, chats }: ChatHistoryGroupProps) {
  // Group chats by conversation_id and only show the first non-AI message
  const uniqueConversations = chats.reduce((acc, chat) => {
    if (!acc[chat.conversation_id]) {
      // Find the first non-AI message in this conversation
      const firstUserMessage = chats
        .filter(c => c.conversation_id === chat.conversation_id && !c.is_ai)
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0];
      
      if (firstUserMessage) {
        acc[chat.conversation_id] = firstUserMessage;
      }
    }
    return acc;
  }, {} as Record<string, ChatHistory>);

  return (
    <div key={label}>
      <div className="px-2 py-1 text-xs text-gray-400">
        {label}
      </div>
      {Object.values(uniqueConversations).map((chat) => (
        <SidebarMenuItem key={chat.id}>
          <SidebarMenuButton className="w-full">
            <MessageSquare className="h-4 w-4" />
            <span className="truncate">{chat.message}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </div>
  )
}