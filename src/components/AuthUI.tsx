import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const AuthUI = () => {
  const [showPassword, setShowPassword] = useState(false);
  const redirectUrl = `${window.location.origin}/auth/callback`;

  return (
    <div className="w-full max-w-md mx-auto bg-black/40 p-6 rounded-lg backdrop-blur-sm border border-primary/20">
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#22c55e',
                brandAccent: '#16a34a',
                inputBackground: 'black',
                inputText: 'white',
                inputPlaceholder: 'gray',
                defaultButtonBackground: 'rgba(0,0,0,0.4)',
                defaultButtonBackgroundHover: 'rgba(0,0,0,0.6)',
              },
            },
          },
          style: {
            button: {
              background: 'linear-gradient(to right, #22c55e, #16a34a)',
              border: 'none',
              color: 'white',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
            },
            input: {
              borderColor: '#22c55e40',
              background: 'rgba(0,0,0,0.4)',
            },
            anchor: {
              color: '#22c55e',
            },
            message: {
              color: '#22c55e',
            },
          },
          extend: {
            password: {
              container: {
                position: 'relative',
              },
              input: {
                paddingRight: '2.5rem',
              },
              icon: {
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#22c55e',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '1.5rem',
                height: '1.5rem',
              },
            },
          },
        }}
        localization={{
          variables: {
            sign_in: {
              password_input: {
                type: showPassword ? 'text' : 'password',
              },
            },
            sign_up: {
              password_input: {
                type: showPassword ? 'text' : 'password',
              },
            },
          },
        }}
        theme="dark"
        providers={["google"]}
        redirectTo={redirectUrl}
        afterComponent={({ children }) => (
          <div style={{ position: 'relative' }}>
            {children}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 transition-colors"
              style={{ marginTop: '-12px' }}
            >
              {showPassword ? (
                <EyeOff size={20} className="opacity-75 hover:opacity-100" />
              ) : (
                <Eye size={20} className="opacity-75 hover:opacity-100" />
              )}
            </button>
          </div>
        )}
      />
    </div>
  );
};

export default AuthUI;