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
}

interface ChatHistoryGroupProps {
  label: string
  chats: ChatHistory[]
}

export function ChatHistoryGroup({ label, chats }: ChatHistoryGroupProps) {
  return (
    <div key={label}>
      <div className="px-2 py-1 text-xs text-gray-400">
        {label}
      </div>
      {chats.map((chat) => (
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