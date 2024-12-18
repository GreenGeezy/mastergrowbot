import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import PasswordToggle from "./auth/PasswordToggle";
import { authStyles } from "./auth/authStyles";

const AuthUI = () => {
  const [showPassword, setShowPassword] = useState(false);
  const redirectUrl = `${window.location.origin}/auth/callback`;

  useEffect(() => {
    const timer = setTimeout(() => {
      const container = document.querySelector('.supabase-auth-ui_ui-container');
      if (!container) return;

      const passwordInput = container.querySelector('input[type="password"]') as HTMLInputElement;
      if (passwordInput && passwordInput.parentNode) {
        const parentElement = passwordInput.parentElement as HTMLElement;
        if (parentElement) {
          parentElement.style.position = 'relative';
          passwordInput.style.paddingRight = '2.5rem';
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleTogglePassword = () => {
    const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
    if (!passwordInput) return;

    const newType = showPassword ? 'password' : 'text';
    passwordInput.type = newType;
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