import { Eye, EyeOff } from "lucide-react";

interface PasswordToggleProps {
  showPassword: boolean;
  onToggle: () => void;
}

const PasswordToggle = ({ showPassword, onToggle }: PasswordToggleProps) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-[50%] -translate-y-[50%] z-[100] text-gray-400 hover:text-white transition-colors duration-200"
      aria-label={showPassword ? "Hide password" : "Show password"}
      style={{
        pointerEvents: 'auto',
      }}
    >
      {showPassword ? (
        <Eye className="h-5 w-5" />
      ) : (
        <EyeOff className="h-5 w-5" />
      )}
    </button>
  );
};

export default PasswordToggle;