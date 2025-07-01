import { useSession } from '@supabase/auth-helpers-react'
import { Plus, MessageCircle, Camera, BookOpen, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
} from '@/components/ui/sidebar'
import { ProfileDropdown } from './profile/ProfileDropdown'
import { ExpandableTabs } from '@/components/ui/expandable-tabs'

interface AppSidebarProps {
  onNewChat?: () => void
  children?: React.ReactNode
}

export function AppSidebar({ onNewChat, children }: AppSidebarProps) {
  const session = useSession()
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path

  // Create tabs for ExpandableTabs component
  const tabs = navigationItems.map((item) => ({
    title: item.title,
    icon: item.icon,
    type: "tab" as const,
    to: item.to,
  }))

  const handleTabChange = (index: number | null) => {
    if (index !== null && tabs[index]) {
      navigate(tabs[index].to)
    }
  }

  const getActiveTabIndex = () => {
    const activeIndex = navigationItems.findIndex(item => isActive(item.to))
    return activeIndex >= 0 ? activeIndex : null
  }

  return (
    <Sidebar className="border-r border-[#333333]" collapsible="icon">
      <SidebarHeader>
        <div className="p-2">
          <div className="flex items-center justify-center mb-6">
            <img
              src="/lovable-uploads/c346bc72-2133-49aa-a5c8-b0773e68ef3b.png"
              alt="Master Growbot"
              className="w-8 h-8"
            />
            <span className="ml-2 text-lg font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent group-data-[collapsible=icon]:hidden">
              Master Growbot
            </span>
          </div>
          {onNewChat && (
            <Button 
              onClick={onNewChat}
              className="w-full cyber-button flex items-center gap-2 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0"
            >
              <Plus className="h-4 w-4" />
              <span className="group-data-[collapsible=icon]:hidden">New Chat</span>
            </Button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            
          </SidebarGroupContent>
        </SidebarGroup>

        {children}
      </SidebarContent>

      <SidebarFooter>
        <div className="p-2">
          <ProfileDropdown />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
