import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import PasswordToggle from "./auth/PasswordToggle";
import { authStyles } from "./auth/authStyles";

const AuthUI = () => {
  const [showPassword, setShowPassword] = useState(false);
  const redirectUrl = `${window.location.origin}/auth/callback`;

  useEffect(() => {
    // Apply custom styles to position the toggle button correctly
    const style = document.createElement('style');
    style.textContent = `
      .supabase-auth-ui_ui-container {
        position: relative;
      }
      .password-toggle-wrapper {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 10;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleTogglePassword = () => {
    const inputs = document.querySelectorAll('input[type="password"], input[type="text"].supabase-auth-ui_ui-input');
    inputs.forEach((input) => {
      if (input instanceof HTMLInputElement && 
          (input.type === 'password' || input.classList.contains('supabase-auth-ui_ui-input'))) {
        // Store the current cursor position
        const cursorPos = input.selectionStart;
        
        // Toggle the input type
        input.type = showPassword ? 'password' : 'text';
        
        // Restore the cursor position
        input.setSelectionRange(cursorPos, cursorPos);
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
        <div className="password-toggle-wrapper">
          <PasswordToggle 
            showPassword={showPassword}
            onToggle={handleTogglePassword}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthUI;