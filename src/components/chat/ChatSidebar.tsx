
"use client";
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { 
  Home, 
  MessageCircle, 
  Camera, 
  BookOpen, 
  Settings, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Search
} from 'lucide-react';
import { ProfileDropdown } from '@/components/profile/ProfileDropdown';
import { useConversations } from '@/hooks/use-conversations';
import { ConversationList } from './ConversationList';

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
}

interface ChatSidebarProps {
  className?: string;
  onNewChat?: () => void;
  currentConversationId?: string | null;
  onConversationSelect?: (id: string) => void;
}

const navigationItems: NavigationItem[] = [
  { id: "home", name: "Home", icon: Home, href: "/" },
  { id: "chat", name: "Chat Assistant", icon: MessageCircle, href: "/chat" },
  { id: "plant-health", name: "Plant Health", icon: Camera, href: "/plant-health" },
  { id: "grow-guide", name: "Growing Guide", icon: BookOpen, href: "/grow-guide" },
  { id: "settings", name: "Settings", icon: Settings, href: "/settings" },
];

export function ChatSidebar({ 
  className = "", 
  onNewChat, 
  currentConversationId, 
  onConversationSelect 
}: ChatSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const session = useSession();
  const supabase = useSupabaseClient();
  const { conversations, isLoading: isLoadingConversations } = useConversations();

  // Auto-open sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleItemClick = (itemId: string, href: string) => {
    if (itemId === "logout") {
      handleLogout();
    } else {
      navigate(href);
    }
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getActiveItem = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/chat') return 'chat';
    if (path === '/plant-health') return 'plant-health';
    if (path === '/grow-guide') return 'grow-guide';
    if (path === '/settings') return 'settings';
    return 'chat';
  };

  const activeItem = getActiveItem();

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-6 left-6 z-50 p-3 rounded-lg bg-card shadow-md border border-white/10 md:hidden hover:bg-card/70 transition-all duration-200"
        aria-label="Toggle sidebar"
      >
        {isOpen ? 
          <X className="h-5 w-5 text-white" /> : 
          <Menu className="h-5 w-5 text-white" />
        }
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300" 
          onClick={toggleSidebar} 
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-card border-r border-white/10 z-40 transition-all duration-300 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-20" : "w-80"}
          md:translate-x-0 md:static md:z-auto
          ${className}
        `}
      >
        {/* Header with logo and collapse button */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          {!isCollapsed && (
            <div className="flex items-center space-x-2.5">
              <img
                src="/lovable-uploads/c346bc72-2133-49aa-a5c8-b0773e68ef3b.png"
                alt="Master Growbot"
                className="w-9 h-9"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-white text-base">Master Growbot</span>
                <span className="text-xs text-gray-400">AI Cannabis Assistant</span>
              </div>
            </div>
          )}

          {isCollapsed && (
            <img
              src="/lovable-uploads/c346bc72-2133-49aa-a5c8-b0773e68ef3b.png"
              alt="Master Growbot"
              className="w-9 h-9 mx-auto"
            />
          )}

          {/* Desktop collapse button */}
          <button
            onClick={toggleCollapse}
            className="hidden md:flex p-1.5 rounded-md hover:bg-white/10 transition-all duration-200"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>

        {/* New Chat Button */}
        {!isCollapsed && onNewChat && (
          <div className="p-4 border-b border-white/10">
            <button
              onClick={onNewChat}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-primary hover:bg-gradient-secondary rounded-lg transition-all duration-200"
            >
              <Plus className="h-5 w-5 text-white" />
              <span className="text-white font-medium">New Chat</span>
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleItemClick(item.id, item.href)}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200 group
                      ${isActive
                        ? "bg-accent/20 text-accent"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                      }
                      ${isCollapsed ? "justify-center px-2" : ""}
                    `}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <div className="flex items-center justify-center min-w-[24px]">
                      <Icon
                        className={`
                          h-5 w-5 flex-shrink-0
                          ${isActive 
                            ? "text-accent" 
                            : "text-gray-400 group-hover:text-white"
                          }
                        `}
                      />
                    </div>
                    
                    {!isCollapsed && (
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-sm ${isActive ? "font-medium" : "font-normal"}`}>
                          {item.name}
                        </span>
                        {item.badge && (
                          <span className={`
                            px-2 py-1 text-xs font-medium rounded-full
                            ${isActive
                              ? "bg-accent/20 text-accent"
                              : "bg-white/10 text-gray-300"
                            }
                          `}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                        {item.name}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-1.5 h-1.5 bg-gray-800 rotate-45" />
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Chat History Section */}
          {!isCollapsed && location.pathname === '/chat' && (
            <div className="mt-6">
              <div className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-white/10 mb-2">
                Recent Conversations
              </div>
              <ConversationList
                conversations={conversations}
                isLoading={isLoadingConversations}
                currentConversationId={currentConversationId}
                onConversationSelect={onConversationSelect || (() => {})}
              />
            </div>
          )}
        </nav>

        {/* Bottom section with profile and logout */}
        <div className="mt-auto border-t border-white/10">
          {/* Profile Section */}
          {!isCollapsed && session && (
            <div className="p-3">
              <ProfileDropdown />
            </div>
          )}

          {/* Logout Button */}
          <div className="p-3">
            <button
              onClick={() => handleItemClick("logout", "")}
              className={`
                w-full flex items-center rounded-lg text-left transition-all duration-200 group
                text-red-400 hover:bg-red-500/10 hover:text-red-300
                ${isCollapsed ? "justify-center p-3" : "space-x-3 px-3 py-3"}
              `}
              title={isCollapsed ? "Logout" : undefined}
            >
              <div className="flex items-center justify-center min-w-[24px]">
                <LogOut className="h-5 w-5 flex-shrink-0" />
              </div>
              
              {!isCollapsed && (
                <span className="text-sm">Sign Out</span>
              )}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                  Sign Out
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-1.5 h-1.5 bg-gray-800 rotate-45" />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
