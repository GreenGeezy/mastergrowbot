import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const AuthUI = () => {
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
                backgroundSecondary: 'rgba(0,0,0,0.4)',
                backgroundPrimary: 'rgba(0,0,0,0.6)',
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
        }}
        theme="dark"
        providers={[]}
      />
    </div>
  );
};

export default AuthUI;