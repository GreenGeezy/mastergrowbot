import { useSession } from '@supabase/auth-helpers-react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar'
import { ProfileDropdown } from './profile/ProfileDropdown'

interface AppSidebarProps {
  onNewChat: () => void
  children?: React.ReactNode
}

export function AppSidebar({ onNewChat, children }: AppSidebarProps) {
  const session = useSession()

  return (
    <Sidebar className="border-r border-[#333333]">
      <SidebarHeader>
        <div className="p-2">
          <Button 
            onClick={onNewChat}
            className="w-full cyber-button flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
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