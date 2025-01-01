import React from "react";
import { Award, Star } from "lucide-react";

const Header = () => {
  return (
    <div className="w-full flex flex-col items-center mb-2 sm:mb-4 animate-fade-in circuit-background">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-glow via-accent-glow to-secondary-glow rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        <div className="relative bg-card p-4 sm:p-6 rounded-full mb-4 sm:mb-6 backdrop-blur-xl ring-1 ring-white/10 hover:ring-accent/30 transition-all duration-500">
          <img 
            src="/lovable-uploads/a72be8e9-0fb6-49e8-985d-127ba951fee7.png" 
            alt="Master Growbot Logo" 
            className="w-20 h-20 sm:w-28 sm:h-28 transform group-hover:scale-105 transition-transform duration-500"
            loading="eager"
            width={112}
            height={112}
            fetchPriority="high"
          />
        </div>
      </div>
      <h1 className="text-3xl sm:text-5xl font-bold mb-3 sm:mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary-glow via-accent to-secondary-glow animate-fade-in px-2 tracking-tight tech-font will-change-transform">
        Master Growbot
      </h1>
      <p className="text-base sm:text-lg text-accent text-center max-w-2xl leading-relaxed mb-4 sm:mb-6 animate-fade-in px-4 font-light">
        Grow Bigger, Grow Better – Unleash Your Cannabis SuperPowers with AI
      </p>
      <div className="flex flex-col items-center space-y-3 animate-fade-in">
        <p className="text-sm sm:text-base text-center font-medium text-gold">
          Created by Award-Winning AI Technologists and Trusted by Leading Cannabis Growers Worldwide
        </p>
        <div className="flex items-center justify-center space-x-3">
          <Award className="w-7 h-7 text-gold animate-float will-change-transform" />
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className="w-6 h-6 fill-gold text-gold"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;