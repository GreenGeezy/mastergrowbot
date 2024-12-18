import { Eye, EyeOff } from "lucide-react";

interface PasswordToggleProps {
  showPassword: boolean;
  onToggle: () => void;
}

const PasswordToggle = ({ showPassword, onToggle }: PasswordToggleProps) => (
  <button
    type="button"
    onClick={onToggle}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 transition-colors"
    style={{ marginTop: '-12px' }}
  >
    {showPassword ? (
      <EyeOff size={20} className="opacity-75 hover:opacity-100" />
    ) : (
      <Eye size={20} className="opacity-75 hover:opacity-100" />
    )}
  </button>
);

export default PasswordToggle;