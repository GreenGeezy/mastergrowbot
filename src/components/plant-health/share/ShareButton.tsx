import { Share2 } from 'lucide-react';

interface ShareButtonProps {
  onClick: () => void;
}

const ShareButton = ({ onClick }: ShareButtonProps) => {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
      className="group flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-800 border border-gray-700 hover:border-primary/50"
    >
      <div className="p-1.5 bg-gradient-to-r from-primary to-[#33C3F0] rounded-lg">
        <Share2 className="w-4 h-4 text-white" />
      </div>
      <div className="ml-3 flex flex-col">
        <h3 className="font-medium text-sm text-white group-hover:text-[#33C3F0] transition-colors duration-300">
          Share Results
        </h3>
        <p className="text-gray-400 text-xs">
          Share your analysis via email, social media, or copy a direct link
        </p>
      </div>
    </div>
  );
};

export default ShareButton;