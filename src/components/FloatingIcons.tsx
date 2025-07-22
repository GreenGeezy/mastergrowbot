import React from 'react';

interface FloatingIcon {
  id: number;
  left: number;
  animationDelay: number;
  animationDuration: number;
  size: number;
}

const FloatingIcons: React.FC = () => {
  // Generate random floating icons
  const icons: FloatingIcon[] = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: Math.random() * 100, // Random position from 0-100%
    animationDelay: Math.random() * 20, // Random delay 0-20s
    animationDuration: 15 + Math.random() * 10, // Duration between 15-25s
    size: 20 + Math.random() * 15, // Size between 20-35px
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {icons.map((icon) => (
        <div
          key={icon.id}
          className="absolute opacity-20 animate-float-up"
          style={{
            left: `${icon.left}%`,
            bottom: '-50px',
            animationDelay: `${icon.animationDelay}s`,
            animationDuration: `${icon.animationDuration}s`,
            width: `${icon.size}px`,
            height: `${icon.size}px`,
          }}
        >
          <img
            src="/lovable-uploads/7eb840fe-4be0-4eff-a325-970028a10e9f.png"
            alt=""
            className="w-full h-full object-contain animate-gentle-rotate"
            style={{
              animationDelay: `${icon.animationDelay}s`,
              animationDuration: `${icon.animationDuration * 0.8}s`,
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default FloatingIcons;