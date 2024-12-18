import { Eye, EyeOff } from "lucide-react";

interface PasswordToggleProps {
  showPassword: boolean;
  onToggle: () => void;
}

const PasswordToggle = ({ showPassword, onToggle }: PasswordToggleProps) => {
  const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement | null;
  if (!passwordInput) return null;

  const parentElement = passwordInput.parentElement;
  if (!parentElement) return null;

  // Get the position relative to the viewport
  const rect = passwordInput.getBoundingClientRect();
  
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
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 50,
        color: '#666',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
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