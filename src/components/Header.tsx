
import React from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[70vh] mb-2 sm:mb-4 animate-fade-in circuit-background">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-glow via-accent-glow to-secondary-glow rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        <a href="https://www.mastergrowbot.com" className="block">
          <div className="relative bg-card p-4 sm:p-6 rounded-full mb-6 sm:mb-8 backdrop-blur-xl ring-1 ring-white/10 hover:ring-accent/30 transition-all duration-500">
            <img src="/lovable-uploads/a72be8e9-0fb6-49e8-985d-127ba951fee7.png" alt="Master Growbot Logo" className="w-24 h-24 sm:w-32 sm:h-32 transform group-hover:scale-105 transition-transform duration-500" loading="eager" width={128} height={128} fetchPriority="high" />
          </div>
        </a>
      </div>
      
      <div className="max-w-4xl mx-auto text-center px-4">
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-[2.4rem] font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-glow via-accent to-secondary-glow animate-fade-in tracking-tight tech-font will-change-transform leading-tight">
            Master Growbot
          </h1>
          
          <p className="text-base sm:text-[1.3rem] text-accent max-w-2xl mx-auto leading-relaxed animate-fade-in font-light">
            Grow Bigger, Grow Better – Unleash Your Cannabis SuperPowers with AI
          </p>

          <div className="max-w-[680px] mx-auto">
            <h2 className="text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-tight mb-8 text-white">
              Save Your Cannabis Plants in Seconds—Snap a Pic, AI Spots Issues Before They Cost You $336 per Plant!
            </h2>
            
            <Link to="/plant-health" className="inline-block transform transition-transform duration-300 hover:scale-105">
              <div className="relative">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-[#00ff95] to-[#4cff79] hover:from-[#00ff95] hover:to-[#4cff79] text-black font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl min-w-[220px] rounded-lg group animate-pulse-glow"
                >
                  <span className="mr-2">Save My Plants</span>
                  <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
                <div className="text-xs text-center mt-2 text-white/80">Grow Bigger & Better with AI</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
