
import React from 'react';

interface VoiceIconProps {
  className?: string;
  size?: number;
}

const VoiceIcon: React.FC<VoiceIconProps> = ({ className = "", size = 20 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Sound wave bars */}
      <rect x="10" y="4" width="4" height="16" rx="2" fill="currentColor" />
      <rect x="6" y="8" width="3" height="8" rx="1.5" fill="currentColor" />
      <rect x="15" y="8" width="3" height="8" rx="1.5" fill="currentColor" />
      <rect x="2" y="10" width="3" height="4" rx="1.5" fill="currentColor" />
      <rect x="19" y="10" width="3" height="4" rx="1.5" fill="currentColor" />
    </svg>
  );
};

export default VoiceIcon;
