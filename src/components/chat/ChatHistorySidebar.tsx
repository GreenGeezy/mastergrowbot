
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MessageSquare, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConversationList } from './ConversationList';
import { useConversations } from '@/hooks/use-conversations';
import { useChatState } from '@/hooks/use-chat-state';

interface ChatHistorySidebarProps {
  onConversationSelect?: (conversationId: string) => void;
}

export const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({ 
  onConversationSelect 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { conversations, isLoading } = useConversations();
  const { currentConversationId } = useChatState();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleConversationSelect = (conversationId: string) => {
    onConversationSelect?.(conversationId);
    // Auto-collapse on mobile after selection
    if (window.innerWidth < 768) {
      setIsExpanded(false);
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed left-0 top-0 h-full bg-white backdrop-blur-md border-r border-gray-200 z-50 transition-all duration-300 ease-in-out flex flex-col
          ${isExpanded ? 'w-80' : 'w-12'}
          md:relative md:z-auto
        `}
      >
        {/* Toggle Button */}
        <div className="flex items-center justify-end p-3 border-b border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            {isExpanded ? (
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-600" />
            )}
          </Button>
        </div>

        {/* Sidebar Content */}
        {isExpanded && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">Chat History</h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">Your recent conversations</p>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto p-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-gray-600">Loading conversations...</div>
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-gray-600 text-sm">No conversations yet</p>
                  <p className="text-gray-500 text-xs mt-1">Start chatting to see your history here</p>
                </div>
              ) : (
                <ConversationList
                  conversations={conversations}
                  isLoading={isLoading}
                  currentConversationId={currentConversationId}
                  onConversationSelect={handleConversationSelect}
                />
              )}
            </div>
          </div>
        )}

        {/* Collapsed State Icon */}
        {!isExpanded && (
          <div className="flex-1 flex items-start justify-center pt-4">
            <MessageSquare className="h-5 w-5 text-gray-600" />
          </div>
        )}
      </div>
    </>
  );
};
