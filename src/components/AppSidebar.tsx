
import { useSession } from '@supabase/auth-helpers-react'
import { Plus, MessageCircle, Camera, BookOpen, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLocation, Link } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { ProfileDropdown } from './profile/ProfileDropdown'
import { cn } from '@/lib/utils'

interface AppSidebarProps {
  onNewChat?: () => void
  children?: React.ReactNode
}

const navigationItems = [
  {
    title: "Growing Assistant",
    subtitle: "Get expert growing advice", 
    to: "/chat",
    icon: MessageCircle,
  },
  {
    title: "Plant Health Check",
    subtitle: "Diagnose plant issues",
    to: "/plant-health", 
    icon: Camera,
  },
  {
    title: "Growing Guide",
    subtitle: "Quick answers to FAQs",
    to: "/grow-guide",
    icon: BookOpen,
  },
  {
    title: "Settings",
    subtitle: "Profile & preferences",
    to: "/profile",
    icon: Settings,
  },
]

export function AppSidebar({ onNewChat, children }: AppSidebarProps) {
  const session = useSession()
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path

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
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.to)} size="lg">
                    <Link 
                      to={item.to}
                      className={cn(
                        "flex flex-col items-start p-4 rounded-lg transition-all duration-200 min-h-[60px] group-data-[collapsible=icon]:min-h-[44px] group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center",
                        isActive(item.to) 
                          ? "bg-accent/10 border-l-2 border-accent text-accent" 
                          : "hover:bg-card/70 text-gray-300 hover:text-accent"
                      )}
                    >
                      <div className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center">
                        <div className={cn(
                          "p-2 rounded-lg transition-colors",
                          isActive(item.to) 
                            ? "bg-accent text-white" 
                            : "bg-gradient-to-br from-primary to-primary/80"
                        )}>
                          <item.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                          <span className="font-medium text-sm">{item.title}</span>
                          <span className="text-xs opacity-80">{item.subtitle}</span>
                        </div>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
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
