
import React, { useState } from "react";
import { Award, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="w-full flex flex-col items-center mb-2 sm:mb-4 animate-fade-in circuit-background min-h-[70vh] flex justify-center">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-glow via-accent-glow to-secondary-glow rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        <a href="https://www.mastergrowbot.com" className="block">
          <div className="relative bg-card p-4 sm:p-6 rounded-full mb-6 sm:mb-8 backdrop-blur-xl ring-1 ring-white/10 hover:ring-accent/30 transition-all duration-500">
            <img src="/lovable-uploads/a72be8e9-0fb6-49e8-985d-127ba951fee7.png" alt="Master Growbot Logo" className="w-20 h-20 sm:w-28 sm:h-28 transform group-hover:scale-105 transition-transform duration-500" loading="eager" width={112} height={112} fetchPriority="high" />
          </div>
        </a>
      </div>
      
      <div className="max-w-4xl mx-auto text-center px-4">
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-glow via-accent to-secondary-glow animate-fade-in tracking-tight tech-font will-change-transform leading-tight">
            Master Growbot
          </h1>
          
          <p className="text-lg text-accent max-w-2xl mx-auto leading-relaxed animate-fade-in font-light sm:text-lg">
            Grow Bigger, Grow Better – Unleash Your Cannabis SuperPowers with AI
          </p>

          <h2 className="text-[clamp(1.8rem,4.2vw,3rem)] font-bold leading-tight max-w-[720px] mx-auto text-white">
            Save Your Cannabis Plants in Seconds—Snap a Pic, AI Spots Issues Before They Cost You $336 per Plant!
          </h2>
          
          <div>
            <Link 
              to="/quiz" 
              className="inline-block transform transition-transform duration-300 mt-5 min-w-[260px]"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <button className="relative overflow-hidden font-semibold text-[1.05rem] py-4 px-8 rounded-[10px] min-w-[260px] text-black bg-gradient-to-b from-[#00ff95] to-[#4cff79] transition-all duration-300 animate-pulse-soft flex items-center justify-center">
                Save My Plants
                <ArrowRight className={`ml-2 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
              </button>
            </Link>
          </div>
          
          <div className="space-y-4">
            <p className="text-base sm:text-lg text-center font-medium text-gold">
              Created by Award-Winning AI Technologists and Trusted by Leading Cannabis Growers Worldwide
            </p>
            
            <div className="flex items-center justify-center space-x-3">
              <Award className="w-7 h-7 text-gold animate-float will-change-transform" />
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, index) => <Star key={index} className="w-6 h-6 fill-gold text-gold" />)}
              </div>
            </div>
          </div>

          <div className="pt-4 text-sm text-muted-foreground">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors mr-4">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
