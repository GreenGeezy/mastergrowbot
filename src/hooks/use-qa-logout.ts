import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useQALogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const qaLogout = searchParams.get('qa') === 'logout';
    
    if (qaLogout) {
      const performLogout = async () => {
        try {
          // Clear Supabase session
          await supabase.auth.signOut();
          
          // Clear any localStorage items related to auth
          localStorage.clear();
          sessionStorage.clear();
          
          // Remove the qa=logout parameter and redirect to root
          const newUrl = window.location.origin + window.location.pathname;
          window.location.replace(newUrl);
        } catch (error) {
          console.error('QA Logout error:', error);
          // Still redirect even if logout fails
          const newUrl = window.location.origin + window.location.pathname;
          window.location.replace(newUrl);
        }
      };
      
      performLogout();
    }
  }, [navigate]);
};