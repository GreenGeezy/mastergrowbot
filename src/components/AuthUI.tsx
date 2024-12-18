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
          const inputs = document.querySelectorAll('input[type="password"]');
          inputs.forEach(input => {
            if (input.parentElement) {
              input.parentElement.style.position = 'relative';
              
              // Create a wrapper div for the input and toggle button
              const wrapper = document.createElement('div');
              wrapper.style.position = 'relative';
              wrapper.className = 'password-input-wrapper';
              
              // Move the input into the wrapper
              input.parentElement.insertBefore(wrapper, input);
              wrapper.appendChild(input);
              
              // Create a toggle button container
              const toggleContainer = document.createElement('div');
              toggleContainer.className = 'password-toggle-container';
              toggleContainer.style.position = 'absolute';
              toggleContainer.style.right = '8px';
              toggleContainer.style.top = '50%';
              toggleContainer.style.transform = 'translateY(-50%)';
              wrapper.appendChild(toggleContainer);
              
              // Create a new password input to replace the original
              const newInput = document.createElement('input');
              Object.assign(newInput, {
                type: showPassword ? 'text' : 'password',
                className: input.className,
                name: input.name,
                placeholder: input.placeholder,
                value: input.value
              });
              
              // Replace the original input
              wrapper.replaceChild(newInput, input);
              
              // Add event listener to sync the input value
              newInput.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement;
                input.value = target.value;
              });
            }
          });
          
          observer.disconnect();
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, [showPassword]);

  const handleTogglePassword = () => {
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