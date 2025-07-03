
import React from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/animated-sidebar";
import { MessageSquare, Plus, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileDropdown } from "@/components/profile/ProfileDropdown";
import { motion } from "framer-motion";

interface ChatSidebarProps {
  onNewChat: () => void;
  onQuestionClick: (question: string) => void;
  quickQuestions: string[];
  conversations: any[];
  isLoadingConversations: boolean;
  currentConversationId: string | null;
  onConversationSelect: (id: string) => void;
}

export const ChatSidebar = ({
  onNewChat,
  onQuestionClick,
  quickQuestions,
  conversations,
  isLoadingConversations,
  currentConversationId,
  onConversationSelect
}: ChatSidebarProps) => {
  const [open, setOpen] = React.useState(false);

  const Logo = () => {
    return (
      <div className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
        <img
          src="/lovable-uploads/c346bc72-2133-49aa-a5c8-b0773e68ef3b.png"
          alt="Master Growbot"
          className="h-8 w-8 flex-shrink-0"
        />
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-medium text-white dark:text-white whitespace-pre"
        >
          Master Growbot
        </motion.span>
      </div>
    );
  };

  const LogoIcon = () => {
    return (
      <div className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
        <img
          src="/lovable-uploads/c346bc72-2133-49aa-a5c8-b0773e68ef3b.png"
          alt="Master Growbot"
          className="h-8 w-8 flex-shrink-0"
        />
      </div>
    );
  };

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-4 bg-card/50 backdrop-blur-sm border-r border-white/10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {open ? <Logo /> : <LogoIcon />}
          
          {/* New Chat Button */}
          <div className="mt-4">
            <Button 
              onClick={onNewChat}
              className="w-full cyber-button flex items-center gap-2 bg-gradient-primary hover:bg-gradient-secondary"
            >
              <Plus className="h-4 w-4" />
              {open && <span>New Chat</span>}
            </Button>
          </div>

          {/* Quick Questions Section */}
          {open && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3 px-2">
                <Lightbulb className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-white">Quick Questions</span>
              </div>
              <div className="space-y-1">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => onQuestionClick(question)}
                    className="w-full text-left p-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 border border-transparent hover:border-accent/20"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat History Section */}
          {open && (
            <div className="mt-6 flex-1">
              <div className="flex items-center gap-2 mb-3 px-2">
                <MessageSquare className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-white">Recent Chats</span>
              </div>
              <div className="space-y-1">
                {isLoadingConversations ? (
                  <div className="px-2 py-1 text-xs text-gray-400">Loading...</div>
                ) : conversations.length === 0 ? (
                  <div className="px-2 py-1 text-xs text-gray-400">No chat history found</div>
                ) : (
                  conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => onConversationSelect(conversation.id)}
                      className={`w-full text-left p-2 rounded-lg transition-all duration-200 ${
                        currentConversationId === conversation.id 
                          ? 'bg-accent/20 text-white border border-accent/30' 
                          : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-accent/20'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 overflow-hidden">
                          <div className="truncate text-xs font-medium">
                            {conversation.title}
                          </div>
                          <div className="truncate text-xs text-gray-400 mt-0.5">
                            {conversation.lastMessage}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Section */}
        <div className="mt-4">
          <ProfileDropdown />
        </div>
      </SidebarBody>
    </Sidebar>
  );
};
