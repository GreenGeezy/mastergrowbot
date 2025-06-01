import React, { useState, useEffect } from 'react';
import { Star, Award, Users, Tag } from "lucide-react";
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
        const hours = Math.floor(timeDiff % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
        const minutes = Math.floor(timeDiff % (1000 * 60 * 60) / (1000 * 60));
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeLeft("Offer expired");
      }
    };
    updateTimer();
    const timer = setInterval(updateTimer, 60000);
    return () => clearInterval(timer);
  }, []);
  return <div className="w-full space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 max-w-4xl w-full">
          <p className="text-white italic text-center text-lg font-extrabold">TESTIMONIAL: 
&quot;Brilliant Technology! Master Growbot saved my new strain from dying, saving me thousands of dollars and time.&quot; – Dr. Sergio, Licensed Medical Practitioner &amp; Grower</p>
        </div>
        <div className="flex items-center justify-center space-x-2 text-[#FFD700]">
          <Users className="w-5 h-5" />
          <span className="font-semibold text-center">Join Our Community of Elite Cannabis Cultivators and AI Enthusiasts</span>
        </div>
        
      </div>

      <div className="bg-[#9b87f5] rounded-lg p-4 text-center transform hover:scale-105 transition-transform duration-300 relative">
        <p className="text-white font-bold text-lg">Unlock 25% Off Quarterly & Over 60% Off Yearly—Offer Ends 7/10/25!</p>
        <p className="text-[#FFD700] font-mono font-bold text-xl">{timeLeft}</p>
        <img src="/lovable-uploads/4e2d074b-bacf-43a5-b44c-a932cd298cdf.png" className="risk-ribbon hidden md:inline-block absolute right-4 top-1/2 transform -translate-y-1/2" style={{
        height: '40px',
        marginLeft: '12px'
      }} alt="Risk-Free – Cancel Anytime" />
        <img src="/lovable-uploads/4e2d074b-bacf-43a5-b44c-a932cd298cdf.png" className="risk-ribbon md:hidden block mx-auto mt-2" style={{
        height: '40px',
        margin: '8px auto 0'
      }} alt="Risk-Free – Cancel Anytime" />
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 items-stretch justify-center w-full">
        {/* Weekly Plan */}
        <div className="flex-1 max-w-sm lg:max-w-none bg-gradient-to-b from-gray-900 to-black rounded-2xl border border-gray-600 shadow-2xl transform hover:scale-105 transition-all duration-300 plan-card relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
            <Badge className="bg-[#FFD700] text-black border border-[#FFD700] px-3 py-1 text-sm font-bold flex items-center gap-1">
              <Tag className="w-3 h-3" />
              Sale
            </Badge>
          </div>
          <div className="p-6 text-center">
            <div className="mb-4">
              <h3 className="text-white text-xl font-bold mb-2">Weekly Plan</h3>
              <div className="text-white/80 text-sm mb-4">Master Growbot</div>
            </div>
            
            <div className="text-center mb-6">
              <div className="price-line">
                <div className="flex items-center justify-center gap-2">
                  <div className="text-white/50 text-2xl font-bold line-through">$9.99</div>
                  <div className="text-white text-4xl font-bold">$8</div>
                </div>
                <div className="text-white/60 text-sm">/week</div>
              </div>
            </div>
            
            <img src="/lovable-uploads/4a1ea5dc-b2d4-48d3-bd79-90775a76fb00.png" className="trust-stamp" style={{
            width: '36px',
            height: '36px',
            margin: '8px auto 4px',
            opacity: 0.9,
            transition: 'transform 0.3s'
          }} alt="Cancel Anytime – No Fee" />
            
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
        <div className="flex-1 max-w-sm lg:max-w-none bg-gradient-to-b from-gray-900 to-black rounded-2xl border border-gray-600 shadow-2xl transform hover:scale-105 transition-all duration-300 plan-card">
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
            
            <img src="/lovable-uploads/4a1ea5dc-b2d4-48d3-bd79-90775a76fb00.png" className="trust-stamp" style={{
            width: '36px',
            height: '36px',
            margin: '8px auto 4px',
            opacity: 0.9,
            transition: 'transform 0.3s'
          }} alt="Cancel Anytime – No Fee" />
            
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
        <div className="flex-1 max-w-sm lg:max-w-none bg-gradient-to-b from-gray-900 to-black rounded-2xl border-2 border-[#FFD700] shadow-2xl transform hover:scale-105 transition-all duration-300 relative plan-card">
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
            
            <img src="/lovable-uploads/4a1ea5dc-b2d4-48d3-bd79-90775a76fb00.png" className="trust-stamp" style={{
            width: '36px',
            height: '36px',
            margin: '8px auto 4px',
            opacity: 0.9,
            transition: 'transform 0.3s'
          }} alt="Cancel Anytime – No Fee" />
            
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

      <div className="flex flex-col items-center space-y-6 w-full">
        <div className="text-center">
          
        </div>
      </div>
    </div>;
}
