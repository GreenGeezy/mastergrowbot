
import React from 'react';

interface AttachmentIconProps {
  className?: string;
  size?: number;
}

const AttachmentIcon: React.FC<AttachmentIconProps> = ({ className = "", size = 20 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Paperclip shape */}
      <path
        d="M21.44 11.05L12.25 20.24C11.12 21.37 9.69 22 8.2 22C6.71 22 5.28 21.37 4.15 20.24C3.02 19.11 2.39 17.68 2.39 16.19C2.39 14.7 3.02 13.27 4.15 12.14L13.34 2.95C14.08 2.21 15.08 1.8 16.12 1.8C17.16 1.8 18.16 2.21 18.9 2.95C19.64 3.69 20.05 4.69 20.05 5.73C20.05 6.77 19.64 7.77 18.9 8.51L10.47 16.94C10.1 17.31 9.6 17.52 9.08 17.52C8.56 17.52 8.06 17.31 7.69 16.94C7.32 16.57 7.11 16.07 7.11 15.55C7.11 15.03 7.32 14.53 7.69 14.16L15.363 6.487"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};

export default AttachmentIcon;
