import { Share2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ShareButtonProps {
  onClick: () => void;
  onMobileShare?: () => void;
}

const ShareButton = ({ onClick, onMobileShare }: ShareButtonProps) => {
  const isMobile = useIsMobile();

  const handleClick = async (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (isMobile && onMobileShare) {
        await onMobileShare();
      } else {
        onClick();
      }
    } catch (error) {
      console.error('Share error:', error);
      // Fallback to dialog if mobile share fails
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e);
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