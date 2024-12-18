import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import PasswordToggle from "./auth/PasswordToggle";
import { authStyles } from "./auth/authStyles";

const AuthUI = () => {
  const [showPassword, setShowPassword] = useState(false);
  const redirectUrl = `${window.location.origin}/auth/callback`;

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          const passwordInput = document.querySelector('input[type="password"]');
          if (passwordInput && passwordInput.parentElement) {
            passwordInput.parentElement.style.position = 'relative';
            observer.disconnect();
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  const handleTogglePassword = () => {
    const passwordInput = document.querySelector('input[type="password"]');
    if (!passwordInput) return;
    
    if (showPassword) {
      passwordInput.setAttribute('type', 'password');
    } else {
      passwordInput.setAttribute('type', 'text');
    }
    
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-black/40 p-6 rounded-lg backdrop-blur-sm border border-primary/20">
      <div className="relative">
        <Auth
          supabaseClient={supabase}
          appearance={authStyles}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email',
                password_label: 'Password',
              },
              sign_up: {
                email_label: 'Email',
                password_label: 'Password',
              },
            },
          }}
          theme="dark"
          providers={["google"]}
          redirectTo={redirectUrl}
        />
        <PasswordToggle 
          showPassword={showPassword}
          onToggle={handleTogglePassword}
        />
      </div>
    </div>
  );
};

export default AuthUI;