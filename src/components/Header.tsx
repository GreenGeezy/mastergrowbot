import React from "react";

const Header = () => {
  return (
    <div className="w-full flex flex-col items-center mb-2 sm:mb-4 animate-fade-in">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-[#33C3F0] to-secondary rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        <div className="relative bg-[#1A1A1A]/90 p-4 sm:p-6 rounded-full mb-4 sm:mb-6 backdrop-blur-xl ring-1 ring-white/10 hover:ring-[#33C3F0]/30 transition-all duration-500">
          <img 
            src="/lovable-uploads/a72be8e9-0fb6-49e8-985d-127ba951fee7.png" 
            alt="Master Growbot Logo" 
            className="w-20 h-20 sm:w-28 sm:h-28 transform group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
      <h1 className="text-3xl sm:text-5xl font-bold mb-3 sm:mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary via-[#33C3F0] to-secondary animate-fade-in px-2 tracking-tight">
        Master Growbot
      </h1>
      <p className="text-base sm:text-lg text-[#8B5CF6] text-center max-w-2xl leading-relaxed mb-2 sm:mb-3 animate-fade-in px-4 font-light">
        Grow Bigger, Grow Better – Unleash Your Cannabis SuperPowers with AI
      </p>
    </div>
  );
};

export default Header;