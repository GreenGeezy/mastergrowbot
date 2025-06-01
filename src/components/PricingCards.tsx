
import React, { useState, useEffect } from 'react';
import { Star, Award, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PricingCards() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const targetDate = new Date('2025-07-01T23:59:59.000Z');
    
    const updateTimer = () => {
      const now = new Date();
      const timeDiff = targetDate.getTime() - now.getTime();
      
      if (timeDiff > 0) {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeLeft("Offer expired");
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 60000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-[1200px] space-y-6 mx-auto">
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 max-w-2xl">
          <p className="text-white italic text-sm">"Brilliant Technology! Master Growbot saved my new strain from dying, saving me thousands of dollars and time." – Dr. Sergio, Licensed Medical Practitioner & Grower</p>
        </div>
        <div className="flex items-center justify-center space-x-2 text-[#FFD700]">
          <Users className="w-5 h-5" />
          <span className="font-semibold">Join Our Community of Elite Cannabis Cultivators and AI Enthusiasts</span>
        </div>
        <div className="flex flex-col items-center space-y-0">
          <p className="text-sm sm:text-base text-center font-medium text-[#FFD700] mb-1">
            Created by Award-Winning AI Technologists and Trusted by Leading Cannabis Growers Worldwide
          </p>
          <div className="flex items-center justify-center space-x-3">
            <Award className="w-7 h-7 text-[#FFD700] animate-float will-change-transform" />
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, index) => <Star key={index} className="w-6 h-6 fill-[#FFD700] text-[#FFD700]" />)}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#9b87f5] rounded-lg p-4 text-center transform hover:scale-105 transition-transform duration-300 relative">
        <p className="text-white font-bold text-lg">Unlock 25% Off Quarterly & Over 60% Off Yearly—Offer Ends 7/10/25!</p>
        <p className="text-[#FFD700] font-mono font-bold text-xl">{timeLeft}</p>
        <img 
          src="/lovable-uploads/4e2d074b-bacf-43a5-b44c-a932cd298cdf.png"
          className="risk-ribbon hidden md:inline-block absolute right-4 top-1/2 transform -translate-y-1/2"
          style={{height: '40px', marginLeft: '12px'}}
          alt="Risk-Free – Cancel Anytime" 
        />
        <img 
          src="/lovable-uploads/4e2d074b-bacf-43a5-b44c-a932cd298cdf.png"
          className="risk-ribbon md:hidden block mx-auto mt-2"
          style={{height: '40px', margin: '8px auto 0'}}
          alt="Risk-Free – Cancel Anytime" 
        />
      </div>
      
      <div className="flex flex-row gap-6 items-stretch justify-center flex-wrap md:flex-nowrap mb-4 mx-0 my-0 py-0 px-0 rounded">
        {/* Weekly Plan */}
        <div className="w-[280px] bg-gradient-to-b from-gray-900 to-black rounded-2xl border border-gray-600 shadow-2xl transform hover:scale-105 transition-all duration-300 plan-card">
          <div className="p-6 text-center">
            <div className="mb-4">
              <h3 className="text-white text-xl font-bold mb-2">Weekly Plan</h3>
              <div className="text-white/80 text-sm mb-4">Master Growbot</div>
            </div>
            
            <div className="text-center mb-6">
              <div className="price-line">
                <div className="text-white text-4xl font-bold">$8</div>
                <div className="text-white/60 text-sm">/week</div>
              </div>
            </div>
            
            <img 
              src="/lovable-uploads/4a1ea5dc-b2d4-48d3-bd79-90775a76fb00.png"
              className="trust-stamp"
              style={{width: '36px', height: '36px', margin: '8px auto 4px', opacity: 0.9, transition: 'transform 0.3s'}}
              alt="Cancel Anytime – No Fee" 
            />
            
            <div className="space-y-3 mb-6 text-left">
              <div className="flex items-center text-white/80 text-sm">
                <span className="mr-2">•</span>
                <span>No-risk: cancel anytime</span>
              </div>
            </div>
            
            <a href="https://square.link/u/HWK25HbP" target="_blank" rel="noopener noreferrer" className="block">
              <button className="w-full bg-[#9b87f5] hover:bg-[#8b7af5] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300">
                Unlock Growbot →
              </button>
            </a>
          </div>
        </div>

        {/* Quarterly Plan */}
        <div className="w-[280px] bg-gradient-to-b from-gray-900 to-black rounded-2xl border border-gray-600 shadow-2xl transform hover:scale-105 transition-all duration-300 plan-card">
          <div className="p-6 text-center">
            <div className="mb-4">
              <h3 className="text-white text-xl font-bold mb-2">Save Your Seconds</h3>
              <div className="text-white/80 text-sm mb-4">Master Growbot Quarterly</div>
            </div>
            
            <div className="text-center mb-6">
              <div className="price-line">
                <div className="text-white text-4xl font-bold">$79</div>
                <div className="text-white/60 text-sm">/quarter</div>
              </div>
            </div>
            
            <img 
              src="/lovable-uploads/4a1ea5dc-b2d4-48d3-bd79-90775a76fb00.png"
              className="trust-stamp"
              style={{width: '36px', height: '36px', margin: '8px auto 4px', opacity: 0.9, transition: 'transform 0.3s'}}
              alt="Cancel Anytime – No Fee" 
            />
            
            <div className="space-y-3 mb-6 text-left">
              <div className="flex items-center text-white/80 text-sm">
                <span className="mr-2">•</span>
                <span>Save 25%</span>
              </div>
              <div className="flex items-center text-white/80 text-sm">
                <span className="mr-2">•</span>
                <span>No-risk: cancel anytime</span>
              </div>
            </div>
            
            <a href="https://square.link/u/mG7rXjby" target="_blank" rel="noopener noreferrer" className="block">
              <button className="w-full bg-[#9b87f5] hover:bg-[#8b7af5] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300">
                Unlock Growbot →
              </button>
            </a>
          </div>
        </div>

        {/* Yearly Plan - Best Value */}
        <div className="w-[280px] bg-gradient-to-b from-gray-900 to-black rounded-2xl border-2 border-[#FFD700] shadow-2xl transform hover:scale-105 transition-all duration-300 relative plan-card">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
            <Badge className="bg-[#FFD700] text-black border border-[#FFD700] px-3 py-1 text-sm font-bold">
              Best Value
            </Badge>
          </div>
          <div className="p-6 text-center">
            <div className="mb-4">
              <h3 className="text-white text-xl font-bold mb-2">Yearly Quarterly</h3>
              <div className="text-white/80 text-sm mb-4">Master Growbot</div>
            </div>
            
            <div className="text-center mb-6">
              <div className="price-line">
                <div className="text-white text-4xl font-bold">$199</div>
                <div className="text-white/60 text-sm">/year</div>
              </div>
            </div>
            
            <img 
              src="/lovable-uploads/4a1ea5dc-b2d4-48d3-bd79-90775a76fb00.png"
              className="trust-stamp"
              style={{width: '36px', height: '36px', margin: '8px auto 4px', opacity: 0.9, transition: 'transform 0.3s'}}
              alt="Cancel Anytime – No Fee" 
            />
            
            <div className="space-y-3 mb-6 text-left">
              <div className="flex items-center text-white/80 text-sm">
                <span className="mr-2">•</span>
                <span>Save Over 60%</span>
              </div>
              <div className="flex items-center text-white/80 text-sm">
                <span className="mr-2">•</span>
                <span>No-risk: cancel anytime</span>
              </div>
            </div>
            
            <a href="https://square.link/u/pa9x0yXT" target="_blank" rel="noopener noreferrer" className="block">
              <button className="w-full bg-[#FFD700] hover:bg-[#e6c200] text-black font-bold py-3 px-6 rounded-lg transition-colors duration-300">
                Unlock Growbot →
              </button>
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-6 w-full max-w-4xl mx-auto">
        <div className="text-center">
          <img 
            src="/lovable-uploads/b85202e0-8c62-45ec-9a0b-b7604644fd7c.png"
            className="trusted-shield mx-auto"
            style={{width: '64px', filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.4))', marginBottom: '12px'}}
            alt="Trusted Seller" 
          />
        </div>
      </div>
    </div>
  );
}
