import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import PasswordToggle from "./auth/PasswordToggle";
import { authStyles } from "./auth/authStyles";

const AuthUI = () => {
  const [showPassword, setShowPassword] = useState(false);
  const redirectUrl = `${window.location.origin}/auth/callback`;

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
          view={showPassword ? "sign_in" : undefined}
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