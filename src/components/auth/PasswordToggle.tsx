import { Eye, EyeOff } from "lucide-react";

interface PasswordToggleProps {
  showPassword: boolean;
  onToggle: () => void;
}

const PasswordToggle = ({ showPassword, onToggle }: PasswordToggleProps) => {
  // Only render if there's a password input and explicitly type it as HTMLInputElement
  const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement | null;
  if (!passwordInput) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className="absolute right-3 top-[50%] -translate-y-[50%] text-gray-400 hover:text-gray-600 transition-colors z-10"
      style={{
        top: `${passwordInput.offsetTop + (passwordInput.offsetHeight / 2)}px`
      }}
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? (
        <Eye size={20} className="opacity-75 hover:opacity-100" />
      ) : (
        <EyeOff size={20} className="opacity-75 hover:opacity-100" />
      )}
    </button>
  );
};

export default PasswordToggle;