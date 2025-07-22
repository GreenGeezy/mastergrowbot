
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#ffffff",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#16a34a",
          foreground: "#ffffff",
          hover: "#15803d",
          glow: "#22c55e",
        },
        secondary: {
          DEFAULT: "#059669",
          foreground: "#ffffff",
          hover: "#047857",
          glow: "#10b981",
        },
        accent: {
          DEFAULT: "#22c55e",
          foreground: "#ffffff",
          hover: "#16a34a",
          glow: "#4ade80",
        },
        gold: {
          DEFAULT: "#f59e0b",
          hover: "#d97706",
          glow: "#fbbf24",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "#f9fafb",
          foreground: "#111827",
          hover: "#f3f4f6",
        },
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "4px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        glow: {
          "0%, 100%": {
            boxShadow: "0 0 15px var(--glow-color)",
          },
          "50%": {
            boxShadow: "0 0 30px var(--glow-color)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "circuit-flow": {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        "float-up": {
          "0%": { 
            transform: "translateY(100vh) translateX(0px) rotate(0deg)",
            opacity: "0"
          },
          "10%": {
            opacity: "0.3"
          },
          "90%": {
            opacity: "0.3"
          },
          "100%": {
            transform: "translateY(-100vh) translateX(20px) rotate(360deg)",
            opacity: "0"
          }
        },
        "gentle-rotate": {
          "0%, 100%": {
            transform: "rotate(0deg)"
          },
          "25%": {
            transform: "rotate(-15deg)"
          },
          "50%": {
            transform: "rotate(0deg)"
          },
          "75%": {
            transform: "rotate(15deg)"
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "pulse-glow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        glow: "glow 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        "circuit-flow": "circuit-flow 3s linear infinite",
        "float-up": "float-up 20s linear infinite",
        "gentle-rotate": "gentle-rotate 25s ease-in-out infinite",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        'gradient-accent': 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        'circuit-pattern': "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10h80v80h-80z' fill='none' stroke='%2316a34a' stroke-width='0.5'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
