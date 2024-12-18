import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import PasswordToggle from "./auth/PasswordToggle";
import { authStyles } from "./auth/authStyles";

const AuthUI = () => {
  const [showPassword, setShowPassword] = useState(false);
  const redirectUrl = `${window.location.origin}/auth/callback`;

  useEffect(() => {
    const container = document.querySelector('.supabase-auth-ui_ui-container');
    if (!container) return;

    // Create a wrapper for the password input if it doesn't exist
    const existingWrapper = container.querySelector('.password-input-wrapper');
    if (!existingWrapper) {
      const passwordInput = container.querySelector('input[type="password"]');
      if (passwordInput && passwordInput.parentNode) {
        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'password-input-wrapper relative';
        
        // Replace password input with wrapper containing the input
        passwordInput.parentNode.replaceChild(wrapper, passwordInput);
        wrapper.appendChild(passwordInput);
      }
    }
  }, []);

  const handleTogglePassword = () => {
    const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
    if (!passwordInput) return;

    const newType = showPassword ? 'password' : 'text';
    const value = passwordInput.value;
    const isInputFocused = document.activeElement === passwordInput;
    const cursorPosition = isInputFocused ? passwordInput.selectionStart : null;

    passwordInput.type = newType;
    passwordInput.value = value;

    if (isInputFocused && cursorPosition !== null) {
      passwordInput.focus();
      passwordInput.setSelectionRange(cursorPosition, cursorPosition);
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