
import { Link } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function ChatHeader() {
  return (
    <div className="flex justify-between items-center p-4 border-b border-[#333333]">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          <span className="sr-only">Toggle menu</span>
        </SidebarTrigger>
        <div className="text-lg font-semibold text-white">Chat</div>
      </div>
    </div>
  );
}
