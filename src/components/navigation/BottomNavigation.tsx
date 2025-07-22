
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Custom Futuristic Icons
  const ChatIcon = ({ isActive }: { isActive: boolean }) => (
    <div className={`relative w-8 h-8 transition-all duration-300 ${isActive ? 'scale-110' : 'hover:scale-105'}`}>
      <div className={`absolute inset-0 rounded-lg ${isActive ? 'bg-gradient-to-r from-emerald-400 to-green-500 shadow-[0_0_20px_rgba(0,255,127,0.5)]' : 'bg-gradient-to-r from-gray-600 to-gray-700'} transition-all duration-300 border border-white/20`}>
        <div className="absolute inset-1 bg-gradient-to-r from-black to-gray-900 rounded-md flex items-center justify-center">
          <div className={`text-xs font-bold ${isActive ? 'text-emerald-300 animate-pulse' : 'text-white/70'}`}>AI</div>
        </div>
      </div>
      {isActive && <div className="absolute -inset-2 bg-emerald-400/20 rounded-xl blur-sm"></div>}
    </div>
  );

  const PlantIcon = ({ isActive }: { isActive: boolean }) => (
    <div className={`relative w-8 h-8 transition-all duration-300 ${isActive ? 'scale-110' : 'hover:scale-105'}`}>
      {/* Camera body */}
      <div className={`absolute inset-0 w-6 h-6 mx-auto my-auto rounded-lg ${isActive ? 'bg-gradient-to-br from-red-400 to-red-600 shadow-[0_0_20px_rgba(255,0,0,0.5)]' : 'bg-gradient-to-br from-red-500 to-red-700 shadow-[0_0_10px_rgba(255,0,0,0.3)]'} transition-all duration-300 border-2 border-white/20`}>
        {/* Camera lens */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-800 to-black border-2 border-white/30">
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-gray-700 to-black">
            <div className="absolute inset-1 rounded-full bg-black flex items-center justify-center">
              <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-red-300 animate-ping' : 'bg-gray-400'}`}></div>
            </div>
          </div>
        </div>
        
        {/* Flash - Lightning bolt */}
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center shadow-[0_0_8px_rgba(255,215,0,0.6)]">
          <svg 
            className="w-1.5 h-1.5 text-white drop-shadow-sm" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {/* Active state glow */}
      {isActive && (
        <div className="absolute -inset-2 bg-red-400/30 rounded-lg blur-sm"></div>
      )}
    </div>
  );

  const GuideIcon = ({ isActive }: { isActive: boolean }) => (
    <div className={`relative w-8 h-8 transition-all duration-300 ${isActive ? 'scale-110' : 'hover:scale-105'}`}>
      {/* Book base */}
      <div className={`absolute inset-0 ${isActive ? 'bg-gradient-to-r from-purple-500 to-indigo-600 shadow-[0_0_20px_rgba(138,43,226,0.5)]' : 'bg-gradient-to-r from-gray-600 to-gray-700'} rounded-sm transition-all duration-300 border border-white/20`}>
        {/* Book pages */}
        <div className="absolute inset-1 bg-gradient-to-r from-white to-gray-100 rounded-sm">
          {/* Holographic pages effect */}
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200/50 to-indigo-200/50 rounded-sm animate-pulse"></div>
          )}
          {/* Page lines */}
          <div className="absolute inset-2 space-y-1">
            <div className={`h-0.5 ${isActive ? 'bg-purple-400' : 'bg-gray-400'} rounded transition-all duration-300`}></div>
            <div className={`h-0.5 ${isActive ? 'bg-purple-400' : 'bg-gray-400'} rounded w-3/4 transition-all duration-300`}></div>
            <div className={`h-0.5 ${isActive ? 'bg-purple-400' : 'bg-gray-400'} rounded w-1/2 transition-all duration-300`}></div>
          </div>
        </div>
      </div>
      {isActive && <div className="absolute -inset-2 bg-purple-400/20 rounded-lg blur-sm"></div>}
    </div>
  );

  const SettingsIcon = ({ isActive }: { isActive: boolean }) => (
    <div className={`relative w-8 h-8 transition-all duration-300 ${isActive ? 'scale-110 animate-spin' : 'hover:scale-105'} ${isActive ? '' : 'hover:rotate-45'}`}>
      {/* Gear outer */}
      <div className={`absolute inset-0 ${isActive ? 'bg-gradient-to-r from-purple-400 to-indigo-500 shadow-[0_0_20px_rgba(138,43,226,0.5)]' : 'bg-gradient-to-r from-gray-600 to-gray-700'} transition-all duration-300 border border-white/20`}
           style={{
             clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
           }}>
        {/* Gear center */}
        <div className="absolute inset-3 bg-gradient-to-r from-black to-gray-900 rounded-full">
          <div className={`absolute inset-1 ${isActive ? 'bg-white' : 'bg-gray-500'} rounded-full transition-all duration-300`}></div>
        </div>
      </div>
      {isActive && <div className="absolute -inset-2 bg-purple-400/20 rounded-xl blur-sm"></div>}
    </div>
  );

  // Navigation items in the new order: Logo, AI Chat, Plant Health, Guide, Settings
  const navigationItems = [
    {
      title: "Home",
      subtitle: "Master Growbot Home",
      to: "/",
      icon: () => (
        <div className="relative w-8 h-8 transition-all duration-300 hover:scale-105">
          <img
            src="/lovable-uploads/95145701-8da0-4e5d-8ac7-afe473b3842c.png"
            alt="Master Growbot Logo"
            className="w-full h-full object-contain transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(0,255,127,0.6)]"
          />
        </div>
      ),
      label: "Home"
    },
    {
      title: "AI Chat",
      subtitle: "Get expert growing advice",
      to: "/chat",
      icon: ChatIcon,
      label: "AI Chat"
    },
    {
      title: "Plant Health",
      subtitle: "Diagnose plant issues",
      to: "/plant-health",
      icon: PlantIcon,
      label: "Plant Health"
    },
    {
      title: "Growing Guide",
      subtitle: "Quick answers to FAQs",
      to: "/grow-guide",
      icon: GuideIcon,
      label: "Guide"
    },
    {
      title: "Settings",
      subtitle: "App settings",
      to: "/settings",
      icon: SettingsIcon,
      label: "Settings"
    }
  ];

  return (
    <nav 
      data-testid="bottom-navigation" 
      className="fixed bottom-0 left-0 right-0 z-50 bg-black backdrop-blur-lg border-t border-emerald-500/20 shadow-[0_-10px_40px_-10px_rgba(0,255,127,0.3)]"
    >
      {/* Futuristic edge effect */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
      
      <div className="px-4 py-4">
        <div className="flex justify-between items-center max-w-md mx-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            
            return (
              <button
                key={item.to}
                onClick={() => {
                  // Special handling for plant health - navigate and trigger camera
                  if (item.to === '/plant-health') {
                    navigate(item.to);
                    setTimeout(() => {
                      const event = new CustomEvent('trigger-camera-capture');
                      window.dispatchEvent(event);
                    }, 100);
                  } else {
                    navigate(item.to);
                  }
                }}
                className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive 
                    ? 'bg-gradient-to-t from-black to-gray-900 shadow-[0_0_20px_rgba(0,255,127,0.4)] border border-emerald-500/30' 
                    : 'bg-gradient-to-t from-gray-900/50 to-gray-800/50 hover:bg-gradient-to-t hover:from-gray-900 hover:to-gray-800 hover:shadow-[0_0_15px_rgba(138,43,226,0.3)] hover:border hover:border-purple-500/20'
                }`}
              >
                {/* Hover glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isActive ? 'opacity-30' : ''}`}></div>
                
                <Icon isActive={isActive} />
                <span className={`text-xs font-medium mt-2 relative z-10 transition-all duration-300 ${
                  isActive 
                    ? 'text-emerald-300 font-semibold drop-shadow-[0_0_6px_rgba(0,255,127,0.8)]' 
                    : 'text-white group-hover:text-purple-200 group-hover:drop-shadow-[0_0_4px_rgba(138,43,226,0.4)]'
                }`} style={{
                  fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                  textShadow: isActive ? '0 0 10px rgba(0,255,127,0.5)' : 'none'
                }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
