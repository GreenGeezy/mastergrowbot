
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const PlantHealthHeader = ({ className = '' }: { className?: string }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`text-center mb-8 animate-fade-in bg-white/95 backdrop-blur-sm rounded-lg p-6 mx-4 ${className}`}>
      <div className="flex items-center justify-center max-w-6xl mx-auto mb-4">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-600 via-green-500 to-green-700 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          <a href="https://www.mastergrowbot.com" className="block">
            <div className="relative bg-gray-100 p-4 rounded-full backdrop-blur-xl ring-1 ring-gray-200 hover:ring-green-300 transition-all duration-500">
              <img 
                src="/lovable-uploads/c346bc72-2133-49aa-a5c8-b0773e68ef3b.png" 
                alt="Master Growbot - AI Cannabis Cultivation Assistant" 
                className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'}`}
              />
            </div>
          </a>
        </div>
      </div>
      <h1 className={`font-bold mb-2 bg-gradient-to-r from-green-600 via-green-500 to-green-700 text-transparent bg-clip-text ${isMobile ? 'text-2xl sm:text-3xl' : 'text-4xl'}`}>
        Plant Health Scanner
      </h1>
      <p className={`text-gray-600 leading-relaxed px-2 ${isMobile ? 'text-sm sm:text-base' : 'text-base'}`}>
        Upload a photo of your plant for instant AI-powered health analysis
      </p>
    </div>
  );
};

export default PlantHealthHeader;
