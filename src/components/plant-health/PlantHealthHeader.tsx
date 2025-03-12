
import React from 'react';
import FeatureSection from '../FeatureSection';

const PlantHealthHeader = () => {
  return (
    <div className="text-center mb-8 animate-fade-in">
      <div className="flex items-center justify-between max-w-6xl mx-auto mb-4">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-[#33C3F0] to-secondary rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          <a href="https://www.mastergrowbot.com" className="block">
            <div className="relative bg-[#1A1A1A]/90 p-4 rounded-full backdrop-blur-xl ring-1 ring-white/10 hover:ring-[#33C3F0]/30 transition-all duration-500">
              <img 
                src="/lovable-uploads/a72be8e9-0fb6-49e8-985d-127ba951fee7.png" 
                alt="Master Growbot - AI Cannabis Cultivation Assistant" 
                className="w-16 h-16"
              />
            </div>
          </a>
        </div>
        <div className="flex-1 ml-4">
          <FeatureSection onFeatureClick={() => {}} />
        </div>
      </div>
      <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 text-transparent bg-clip-text">
        Plant Health Scanner
      </h1>
      <p className="text-gray-400">
        Upload a photo of your plant for instant AI-powered health analysis
      </p>
    </div>
  );
};

export default PlantHealthHeader;
