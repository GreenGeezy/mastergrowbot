import { Eye, EyeOff } from "lucide-react";

interface PasswordToggleProps {
  showPassword: boolean;
  onToggle: () => void;
}

const PasswordToggle = ({ showPassword, onToggle }: PasswordToggleProps) => (
  <button
    type="button"
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onToggle();
    }}
    className="absolute right-3 top-[135px] text-primary hover:text-primary/80 transition-colors"
    aria-label={showPassword ? "Hide password" : "Show password"}
  >
    {showPassword ? (
      <Eye size={20} className="opacity-75 hover:opacity-100" />
    ) : (
      <EyeOff size={20} className="opacity-75 hover:opacity-100" />
    )}
  </button>
);

export default PasswordToggle;