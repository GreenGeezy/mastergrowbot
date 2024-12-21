import { useSession } from '@supabase/auth-helpers-react'
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { MessageSquare, Settings, UserRound, Plus } from 'lucide-react'
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
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

interface ChatHistory {
  id: string
  message: string
  created_at: string
}

interface ChatHistoryGroup {
  label: string
  chats: ChatHistory[]
}

export function AppSidebar() {
  const session = useSession()
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (session?.user?.id) {
      loadChatHistory()
    }
  }, [session?.user?.id])

  const loadChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_history')
        .select('id, message, created_at')
        .eq('user_id', session?.user?.id)
        .eq('is_ai', false)
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) setChatHistory(data)
    } catch (error) {
      console.error('Error loading chat history:', error)
    }
  }

  const groupChatsByDate = (chats: ChatHistory[]): ChatHistoryGroup[] => {
    const groups: { [key: string]: ChatHistory[] } = {}
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    chats.forEach(chat => {
      const chatDate = new Date(chat.created_at)
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

      if (!groups[label]) {
        groups[label] = []
      }
      groups[label].push(chat)
    })

    return Object.entries(groups).map(([label, chats]) => ({
      label,
      chats: chats.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    }))
  }

  const filteredHistory = chatHistory.filter(chat =>
    chat.message.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const groupedChats = groupChatsByDate(filteredHistory)

  return (
    <Sidebar className="border-r border-[#333333]">
      <SidebarHeader>
        <div className="p-2">
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
            <Button 
              variant="ghost" 
              size="icon"
              className="h-7 w-7 text-gray-400 hover:text-white"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {groupedChats.map((group) => (
                <div key={group.label}>
                  <div className="px-2 py-1 text-xs text-gray-400">
                    {group.label}
                  </div>
                  {group.chats.map((chat) => (
                    <SidebarMenuItem key={chat.id}>
                      <SidebarMenuButton className="w-full">
                        <MessageSquare className="h-4 w-4" />
                        <span className="truncate">{chat.message}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </div>
              ))}
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