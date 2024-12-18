import { Eye, EyeOff } from "lucide-react";

interface PasswordToggleProps {
  showPassword: boolean;
  onToggle: () => void;
}

const PasswordToggle = ({ showPassword, onToggle }: PasswordToggleProps) => {
  // Only render the toggle if there's a password input
  const passwordInput = document.querySelector('input[type="password"]');
  if (!passwordInput) return null;

  // Get the position of the password input
  const inputRect = passwordInput.getBoundingClientRect();
  const topOffset = inputRect.top + window.scrollY;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      style={{
        position: 'absolute',
        top: `${topOffset}px`,
        right: '12px',
        transform: 'translateY(-50%)',
      }}
      className="text-primary hover:text-primary/80 transition-colors"
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