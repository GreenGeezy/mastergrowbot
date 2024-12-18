import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import PasswordToggle from "./auth/PasswordToggle";
import { authStyles } from "./auth/authStyles";

const AuthUI = () => {
  const [showPassword, setShowPassword] = useState(false);
  const redirectUrl = `${window.location.origin}/auth/callback`;

  const handleTogglePassword = () => {
    const passwordInputs = document.querySelectorAll('input[type="password"], input[type="text"]') as NodeListOf<HTMLInputElement>;
    
    passwordInputs.forEach(input => {
      if (input.name === 'password' || input.placeholder.toLowerCase().includes('password')) {
        const value = input.value;
        const isInputFocused = document.activeElement === input;
        const cursorPosition = isInputFocused ? input.selectionStart : null;
        
        // Change type and preserve value in a single operation
        const newType = !showPassword ? 'text' : 'password';
        const tempInput = input.cloneNode(true) as HTMLInputElement;
        tempInput.type = newType;
        tempInput.value = value;
        input.parentNode?.replaceChild(tempInput, input);

        // Restore focus and cursor position if needed
        if (isInputFocused && cursorPosition !== null) {
          tempInput.focus();
          tempInput.setSelectionRange(cursorPosition, cursorPosition);
        }
      }
    });

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