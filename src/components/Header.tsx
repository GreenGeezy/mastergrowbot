
import React from "react";
import { Award, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <div className="w-full flex flex-col items-center mt-2 animate-fade-in circuit-background">
      <h1 className="text-3xl sm:text-5xl font-bold mb-3 sm:mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary-glow via-accent to-secondary-glow animate-fade-in px-2 tracking-tight tech-font will-change-transform">
        Unlock Your AI Growing SuperPowers
      </h1>
      <p className="text-base sm:text-lg text-accent text-center max-w-2xl leading-relaxed mb-4 sm:mb-6 animate-fade-in px-4 font-light">
        Grow Bigger, Grow Better with Master Growbot
      </p>
      <div className="flex flex-col items-center space-y-3 animate-fade-in">
        <p className="text-sm sm:text-base text-center font-medium text-gold mb-2">
          Created by Award-Winning AI Technologists and Trusted by Leading Cannabis Growers Worldwide
        </p>
        <div className="flex items-center justify-center space-x-3 mb-8">
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
        <Link to="/quiz" className="transform transition-transform duration-300 hover:scale-105">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-primary via-primary-hover to-primary-glow hover:from-secondary hover:via-secondary-hover hover:to-secondary-glow text-white font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl animate-pulse-glow"
          >
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Header;
