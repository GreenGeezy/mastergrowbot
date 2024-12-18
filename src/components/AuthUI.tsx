import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import PasswordToggle from "./auth/PasswordToggle";
import { authStyles } from "./auth/authStyles";

const AuthUI = () => {
  const [showPassword, setShowPassword] = useState(false);
  const redirectUrl = `${window.location.origin}/auth/callback`;

  const handleTogglePassword = () => {
    const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
    if (!passwordInput) return;

    const newType = showPassword ? 'password' : 'text';
    const value = passwordInput.value;
    const isInputFocused = document.activeElement === passwordInput;
    const cursorPosition = isInputFocused ? passwordInput.selectionStart : null;

    // Create a new input element with the desired type
    const tempInput = passwordInput.cloneNode(true) as HTMLInputElement;
    tempInput.type = newType;
    tempInput.value = value;

    // Replace the old input with the new one
    if (passwordInput.parentNode) {
      passwordInput.parentNode.replaceChild(tempInput, passwordInput);
    }

    // Restore focus and cursor position if needed
    if (isInputFocused && cursorPosition !== null) {
      tempInput.focus();
      tempInput.setSelectionRange(cursorPosition, cursorPosition);
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