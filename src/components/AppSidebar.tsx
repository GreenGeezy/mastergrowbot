import { useSession } from '@supabase/auth-helpers-react'
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Settings, UserRound, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { ChatHistoryList } from './sidebar/ChatHistoryList'

interface ChatHistory {
  id: string
  message: string
  created_at: string
  is_ai: boolean
  conversation_id: string
}

interface ChatHistoryGroup {
  label: string
  chats: ChatHistory[]
}

interface AppSidebarProps {
  onNewChat: () => void
}

export function AppSidebar({ onNewChat }: AppSidebarProps) {
  const session = useSession()
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.id) {
      loadChatHistory()
    }
  }, [session?.user?.id])

  const loadChatHistory = async () => {
    try {
      setIsLoading(true)
      
      if (!session?.user?.id) {
        return
      }

      const { data: messages, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      if (messages) {
        setChatHistory(messages)
      } else {
        setChatHistory([])
      }
    } catch (error) {
      console.error('Error loading chat history:', error)
      setChatHistory([])
    } finally {
      setIsLoading(false)
    }
  }

  const groupChatsByConversation = (chats: ChatHistory[]): ChatHistoryGroup[] => {
    const groups: { [key: string]: ChatHistory[] } = {}
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    // Group messages by conversation_id
    chats.forEach(chat => {
      if (!chat.conversation_id) return
      
      if (!groups[chat.conversation_id]) {
        groups[chat.conversation_id] = []
      }
      groups[chat.conversation_id].push(chat)
    })

    // Convert to array and sort by date
    return Object.entries(groups).map(([_, chats]) => {
      const firstMessage = chats[0]
      const chatDate = new Date(firstMessage.created_at)
      let label = ''

      if (chatDate.toDateString() === today.toDateString()) {
        label = 'Today'
      } else if (chatDate.toDateString() === yesterday.toDateString()) {
        label = 'Yesterday'
      } else if (chatDate >= new Date(today.setDate(today.getDate() - 7))) {
        label = 'Previous 7 Days'
      } else if (chatDate >= new Date(today.setDate(today.getDate() - 30))) {
        label = 'Previous 30 Days'
      } else {
        const month = chatDate.toLocaleString('default', { month: 'long' })
        const year = chatDate.getFullYear()
        label = `${month} ${year}`
      }

      return {
        label,
        chats: chats.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      }
    }).sort((a, b) => {
      return new Date(b.chats[0].created_at).getTime() - new Date(a.chats[0].created_at).getTime()
    })
  }

  const filteredHistory = chatHistory.filter(chat =>
    chat.message.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const groupedChats = groupChatsByConversation(filteredHistory)

  return (
    <Sidebar className="border-r border-[#333333]">
      <SidebarHeader>
        <div className="p-2 space-y-2">
          <Button 
            onClick={onNewChat}
            className="w-full cyber-button flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#333333] border-[#444444] text-white placeholder:text-gray-400"
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between px-2 mb-2">
            <SidebarGroupLabel>Chat History</SidebarGroupLabel>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              <ChatHistoryList 
                isLoading={isLoading}
                groupedChats={groupedChats}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <UserRound className="h-4 w-4" />
              <span>Profile</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}