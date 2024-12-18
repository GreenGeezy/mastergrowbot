import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import PasswordToggle from "./auth/PasswordToggle";
import { authStyles } from "./auth/authStyles";

const AuthUI = () => {
  const [showPassword, setShowPassword] = useState(false);
  const redirectUrl = `${window.location.origin}/auth/callback`;

  useEffect(() => {
    const passwordInputs = document.querySelectorAll('input[type="password"], input[type="text"]') as NodeListOf<HTMLInputElement>;
    passwordInputs.forEach(input => {
      if (input.name === 'password' || input.placeholder.toLowerCase().includes('password')) {
        const currentValue = input.value;
        const currentType = input.type;
        
        // Only change the type if it's different from what we want
        // Note: We've inverted the condition here to match the icon state
        if ((!showPassword && currentType !== 'text') || (showPassword && currentType !== 'password')) {
          input.type = !showPassword ? 'text' : 'password';
          input.value = currentValue;
          
          // Maintain focus and cursor position if the input was focused
          if (document.activeElement === input) {
            const position = input.selectionStart;
            requestAnimationFrame(() => {
              input.focus();
              input.setSelectionRange(position, position);
            });
          }
        }
      }
    });
  }, [showPassword]);

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
          onToggle={() => setShowPassword(!showPassword)}
        />
      </div>
    </div>
  );
};

export default AuthUI;