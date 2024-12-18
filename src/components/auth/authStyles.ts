import { ThemeSupa } from "@supabase/auth-ui-shared";

export const authStyles = {
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
};