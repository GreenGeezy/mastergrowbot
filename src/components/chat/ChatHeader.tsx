
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/ui/sidebar';
import { supabase } from '@/integrations/supabase/client';

export function ChatHeader() {
  const session = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check session on mount and when session changes
    setIsAuthenticated(!!session);

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      console.log('[ChatHeader] Auth state changed:', event);
      
      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [session]);

  return (
    <div className="flex justify-between items-center p-4 border-b border-[#333333]">
      <div className="flex items-center gap-2">
        <Sidebar.Trigger>
          <Button variant="ghost" size="icon" className="md:hidden">
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
          </Button>
        </Sidebar.Trigger>
        <div className="text-lg font-semibold text-white">Master Growbot Chat</div>
      </div>
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <div className="text-white text-sm">Signed In</div>
        ) : (
          <Link to="/">
            <Button variant="outline" size="sm" className="bg-primary text-white">
              Log In
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
