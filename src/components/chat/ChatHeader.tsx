
import React, { useState, useEffect } from 'react';
import { MessageSquare, Sprout, HelpCircle, ChevronDown, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SupportDialog from '@/components/support/SupportDialog';
import { supabase } from '@/integrations/supabase/client';
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { toast } from '@/hooks/use-toast';
import { getRedirectUrl } from '@/utils/urlUtils';

export const ChatHeader = () => {
  const [showSupport, setShowSupport] = useState(false);
  const navigate = useNavigate();
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check authentication status on mount and when session changes
  useEffect(() => {
    async function checkAuth() {
      try {
        const { data } = await supabase.auth.getSession();
        const hasSession = !!data.session;
        console.log('[ChatHeader] Session check:', hasSession ? 'Found session' : 'No session');
        
        if (hasSession !== isAuthenticated) {
          console.log('[ChatHeader] Updating authentication state:', hasSession);
          setIsAuthenticated(hasSession);
        }
        
        if (data.session?.user) {
          console.log('[ChatHeader] User ID:', data.session.user.id);
        }
      } catch (err) {
        console.error('[ChatHeader] Error checking auth:', err);
      }
    }
    
    checkAuth();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('[ChatHeader] Auth state changed event:', event);
      const hasSession = !!newSession;
      
      if (hasSession !== isAuthenticated) {
        console.log('[ChatHeader] Updating authentication state from event:', hasSession);
        setIsAuthenticated(hasSession);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [session, isAuthenticated]);

  // Verify auth state when component mounts
  useEffect(() => {
    async function verifyAuthState() {
      const { data } = await supabase.auth.getSession();
      const hasSession = !!data.session;
      
      console.log('[ChatHeader] Initial auth verification:', hasSession ? 'Authenticated' : 'Not authenticated');
      setIsAuthenticated(hasSession);
    }
    
    verifyAuthState();
  }, []);

  const growTools = [
    {
      title: "Growing Assistant",
      description: "Get expert growing advice",
      path: "/chat",
    },
    {
      title: "Plant Health Check",
      description: "Diagnose plant issues",
      path: "/plant-health",
    },
    {
      title: "Growing Guide",
      description: "Quick answers to FAQs",
      path: "/grow-guide",
    },
  ];

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('[ChatHeader] Error signing out:', error);
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setIsAuthenticated(false);
        navigate('/');
      }
    } catch (err) {
      console.error('[ChatHeader] Error during sign out:', err);
      toast({
        title: "Error signing out",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      // Get a properly formatted redirect URL
      const redirectTo = getRedirectUrl();
      console.log('[ChatHeader] Using redirect URL for auth:', redirectTo);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo
        }
      });
      
      if (error) {
        console.error('[ChatHeader] Google sign in error:', error);
        toast({
          title: "Login error",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('[ChatHeader] Unexpected error during Google sign in:', err);
      toast({
        title: "Login error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center p-4 border-b border-[#333333] bg-[#1A1A1A] h-[80px]">
        <div className="flex items-center space-x-3 mr-4">
          <a href="https://www.mastergrowbot.com" className="hover:opacity-80 transition-opacity">
            <img 
              src="/lovable-uploads/a72be8e9-0fb6-49e8-985d-127ba951fee7.png" 
              alt="Master Growbot Logo" 
              className="w-10 h-10 rounded-full"
            />
          </a>
          <h1 className="text-xl font-semibold text-white">Master Growbot</h1>
        </div>
        
        <div className="flex items-center justify-between flex-1 px-4">
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-2 text-green-500 hover:text-green-400 font-bold"
                >
                  <Sprout className="w-6 h-6" />
                  <span>Grow Tools</span>
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#1A1A1A] border border-[#333333]">
                {growTools.map((tool) => (
                  <DropdownMenuItem
                    key={tool.path}
                    onClick={() => navigate(tool.path)}
                    className="flex flex-col items-start p-3 hover:bg-[#2D5A27] cursor-pointer"
                  >
                    <span className="font-semibold text-white">{tool.title}</span>
                    <span className="text-xs text-gray-400">{tool.description}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-5 h-5 text-gray-400 hover:text-gray-300 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-[#1A1A1A] border border-[#333333] p-3">
                <p className="text-sm">Access our AI-powered growing tools: Get expert advice, diagnose plant issues, and find quick answers to common questions.</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => setShowSupport(true)} 
              className="flex items-center space-x-2 text-purple-400 hover:text-purple-300"
            >
              <MessageSquare className="w-6 h-6" />
              <span className="font-medium">Feedback</span>
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline"
                    className="bg-purple-600 hover:bg-purple-700 text-white border-none flex items-center space-x-2"
                  >
                    <User className="w-5 h-5 mr-1" />
                    <span className="font-medium">Signed In</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-[#1A1A1A] border border-[#333333]">
                  <DropdownMenuItem 
                    onClick={() => navigate('/profile')}
                    className="p-3 hover:bg-purple-600 cursor-pointer text-white"
                  >
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#333333]" />
                  <DropdownMenuItem 
                    className="p-3 hover:bg-purple-600 cursor-pointer text-white"
                    onClick={handleSignOut}
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing out..." : "Sign Out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline"
                    className="bg-purple-600 hover:bg-purple-700 text-white border-none flex items-center space-x-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="font-medium">Processing...</span>
                    ) : (
                      <>
                        <span className="font-medium">Log In</span>
                        <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-[#1A1A1A] border border-[#333333]">
                  <DropdownMenuItem asChild>
                    <Link to="/" className="w-full p-3 hover:bg-purple-600 text-white">
                      Log In with Email
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#333333]" />
                  <DropdownMenuItem 
                    className="p-3 hover:bg-purple-600 cursor-pointer"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                  >
                    <div className="flex items-center space-x-2 text-white">
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      <span>Log In with Google</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#333333]" />
                  <DropdownMenuItem asChild>
                    <Link to="/" className="w-full p-3 hover:bg-purple-600 text-white">
                      Register New Account
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
      <div className="h-[80px]"></div>
      <SupportDialog isOpen={showSupport} onOpenChange={setShowSupport} />
    </>
  );
};
