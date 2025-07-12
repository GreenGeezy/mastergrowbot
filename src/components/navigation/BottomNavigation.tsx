
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Custom 3D Cyberpunk Icons
  const ChatIcon = ({ isActive }: { isActive: boolean }) => (
    <div className={`relative w-8 h-8 transition-all duration-300 ${isActive ? 'scale-110' : 'hover:scale-105'}`}>
      <div className={`absolute inset-0 rounded-lg ${isActive ? 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_20px_rgba(0,255,255,0.5)]' : 'bg-gradient-to-r from-gray-600 to-gray-700'} transition-all duration-300`}>
        <div className="absolute inset-1 bg-gradient-to-r from-gray-800 to-gray-900 rounded-md flex items-center justify-center">
          <div className={`text-xs font-bold ${isActive ? 'text-cyan-300 animate-pulse' : 'text-gray-400'}`}>AI</div>
        </div>
      </div>
      {isActive && <div className="absolute -inset-2 bg-cyan-400/20 rounded-xl blur-sm"></div>}
    </div>
  );

  const PlantIcon = ({ isActive }: { isActive: boolean }) => (
    <div className={`relative w-8 h-8 transition-all duration-300 ${isActive ? 'scale-110' : 'hover:scale-105'}`}>
      {/* Camera lens outer ring */}
      <div className={`absolute inset-0 rounded-full border-2 ${isActive ? 'border-green-400 shadow-[0_0_20px_rgba(0,255,0,0.5)]' : 'border-gray-600'} transition-all duration-300`}>
        {/* Lens center */}
        <div className={`absolute inset-2 rounded-full ${isActive ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-gray-600 to-gray-700'} transition-all duration-300`}>
          <div className="absolute inset-1 bg-black rounded-full flex items-center justify-center">
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-300 animate-ping' : 'bg-gray-500'}`}></div>
          </div>
        </div>
      </div>
      {/* AI analysis waves */}
      {isActive && (
        <>
          <div className="absolute -inset-3 border border-green-400/30 rounded-full animate-ping"></div>
          <div className="absolute -inset-4 border border-green-400/20 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        </>
      )}
      {/* Leaf indicator */}
      <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${isActive ? 'text-green-300' : 'text-gray-500'} transition-all duration-300`}>
        <div className="w-full h-full bg-current rounded-full opacity-80"></div>
      </div>
    </div>
  );

  const GuideIcon = ({ isActive }: { isActive: boolean }) => (
    <div className={`relative w-8 h-8 transition-all duration-300 ${isActive ? 'scale-110' : 'hover:scale-105'}`}>
      {/* Book base */}
      <div className={`absolute inset-0 ${isActive ? 'bg-gradient-to-r from-purple-500 to-indigo-600 shadow-[0_0_20px_rgba(147,51,234,0.5)]' : 'bg-gradient-to-r from-gray-600 to-gray-700'} rounded-sm transition-all duration-300`}>
        {/* Book pages */}
        <div className="absolute inset-1 bg-gradient-to-r from-gray-100 to-white rounded-sm">
          {/* Holographic pages effect */}
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200/50 to-blue-200/50 rounded-sm animate-pulse"></div>
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
      <div className={`absolute inset-0 ${isActive ? 'bg-gradient-to-r from-orange-400 to-red-500 shadow-[0_0_20px_rgba(255,165,0,0.5)]' : 'bg-gradient-to-r from-gray-600 to-gray-700'} transition-all duration-300`}
           style={{
             clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
           }}>
        {/* Gear center */}
        <div className="absolute inset-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full">
          <div className={`absolute inset-1 ${isActive ? 'bg-orange-300' : 'bg-gray-500'} rounded-full transition-all duration-300`}></div>
        </div>
      </div>
      {isActive && <div className="absolute -inset-2 bg-orange-400/20 rounded-xl blur-sm"></div>}
    </div>
  );

  // Navigation items for bottom tabs
  const navigationItems = [
    {
      title: "Growing Assistant",
      subtitle: "Get expert growing advice",
      to: "/chat",
      icon: ChatIcon,
      label: "Chat"
    },
    {
      title: "Plant Health Check",
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
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black via-gray-900 to-gray-800 backdrop-blur-lg border-t border-cyan-500/20 shadow-[0_-10px_40px_-10px_rgba(0,255,255,0.3)]">
      {/* Cyberpunk metallic edge effect */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
      
      <div className="flex justify-center p-4">
        <div className="flex gap-4 w-full max-w-md items-center">
          {/* Logo button to navigate home */}
          <button
            onClick={() => navigate('/')}
            className="flex-shrink-0 p-3 rounded-xl transition-all duration-300 hover:bg-gray-800/70 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] group"
          >
            <img
              src="/lovable-uploads/f3f24387-a344-47bd-b46b-d5996b6c9afd.png"
              alt="Master Growbot Logo"
              className="w-8 h-8 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"
            />
          </button>
          
          {/* Navigation items */}
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            
            return (
              <button
                key={item.to}
                onClick={() => navigate(item.to)}
                className={`flex-1 flex flex-col items-center p-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive 
                    ? 'bg-gradient-to-t from-gray-900 to-gray-800 shadow-[0_0_20px_rgba(0,255,255,0.4)] border border-cyan-500/30' 
                    : 'bg-gradient-to-t from-gray-800/50 to-gray-700/50 hover:bg-gradient-to-t hover:from-gray-800 hover:to-gray-700 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] hover:border hover:border-cyan-500/20'
                }`}
              >
                {/* Subtle hover glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isActive ? 'opacity-30' : ''}`}></div>
                
                <Icon isActive={isActive} />
                <span className={`text-xs font-medium mt-2 relative z-10 transition-all duration-300 ${
                  isActive 
                    ? 'text-cyan-300 font-semibold drop-shadow-[0_0_6px_rgba(0,255,255,0.8)]' 
                    : 'text-gray-300 group-hover:text-cyan-200 group-hover:drop-shadow-[0_0_4px_rgba(0,255,255,0.4)]'
                }`} style={{
                  fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                  textShadow: isActive ? '0 0 10px rgba(0,255,255,0.5)' : 'none'
                }}>
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* Settings gear icon */}
          <button
            onClick={() => navigate('/settings')}
            className={`flex-shrink-0 flex flex-col items-center p-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
              location.pathname === '/settings'
                ? 'bg-gradient-to-t from-gray-900 to-gray-800 shadow-[0_0_20px_rgba(255,165,0,0.4)] border border-orange-500/30' 
                : 'bg-gradient-to-t from-gray-800/50 to-gray-700/50 hover:bg-gradient-to-t hover:from-gray-800 hover:to-gray-700 hover:shadow-[0_0_15px_rgba(255,165,0,0.2)] hover:border hover:border-orange-500/20'
            }`}
          >
            {/* Subtle hover glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-t from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${location.pathname === '/settings' ? 'opacity-30' : ''}`}></div>
            
            <SettingsIcon isActive={location.pathname === '/settings'} />
            <span className={`text-xs font-medium mt-2 relative z-10 transition-all duration-300 ${
              location.pathname === '/settings'
                ? 'text-orange-300 font-semibold drop-shadow-[0_0_6px_rgba(255,165,0,0.8)]' 
                : 'text-gray-300 group-hover:text-orange-200 group-hover:drop-shadow-[0_0_4px_rgba(255,165,0,0.4)]'
            }`} style={{
              fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
              textShadow: location.pathname === '/settings' ? '0 0 10px rgba(255,165,0,0.5)' : 'none'
            }}>
              Settings
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
