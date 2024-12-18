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
      mutations.forEach(() => {
        const passwordInputs = document.querySelectorAll('input[type="password"]') as NodeListOf<HTMLInputElement>;
        passwordInputs.forEach(input => {
          if (input.name === 'password' || input.placeholder.toLowerCase().includes('password')) {
            const value = input.value;
            if (showPassword) {
              input.type = 'text';
              // Ensure value is preserved after type change
              setTimeout(() => {
                input.value = value;
              }, 0);
            } else {
              input.type = 'password';
              // Ensure value is preserved after type change
              setTimeout(() => {
                input.value = value;
              }, 0);
            }
          }
        });
      });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });

    return () => observer.disconnect();
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