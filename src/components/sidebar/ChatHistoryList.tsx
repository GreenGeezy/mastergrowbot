import { ChatHistoryGroup } from './ChatHistoryGroup'

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

interface ChatHistoryListProps {
  isLoading: boolean
  groupedChats: ChatHistoryGroup[]
}

export function ChatHistoryList({ isLoading, groupedChats }: ChatHistoryListProps) {
  if (isLoading) {
    return <div className="px-2 py-1 text-gray-400">Loading...</div>
  }

  if (groupedChats.length === 0) {
    return <div className="px-2 py-1 text-gray-400">No chat history found</div>
  }

  return (
    <>
      {groupedChats.map((group) => (
        <ChatHistoryGroup 
          key={group.label} 
          label={group.label} 
          chats={group.chats} 
        />
      ))}
    </>
  )
}