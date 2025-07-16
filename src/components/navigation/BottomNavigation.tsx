
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

  const PlantIcon = ({ isActive, isCenter = false }: { isActive: boolean; isCenter?: boolean }) => {
    const size = isCenter ? 'w-14 h-14' : 'w-8 h-8';
    const cameraSize = isCenter ? 'w-12 h-12' : 'w-6 h-6';
    
    return (
      <div className={`relative ${size} transition-all duration-300 ${isActive ? 'scale-110' : 'hover:scale-105'} ${isCenter ? 'animate-pulse' : ''}`}>
        {/* Camera body */}
        <div className={`absolute inset-0 ${cameraSize} mx-auto my-auto rounded-lg ${isActive ? 'bg-gradient-to-br from-pink-400 to-red-500 shadow-[0_0_30px_rgba(255,20,147,0.6)]' : 'bg-gradient-to-br from-pink-300 to-red-400 shadow-[0_0_15px_rgba(255,20,147,0.3)]'} transition-all duration-300 border-2 border-white/20`}>
          {/* Camera lens */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-800 to-black border-2 border-white/30">
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-gray-700 to-black">
              <div className="absolute inset-1 rounded-full bg-black flex items-center justify-center">
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-pink-300 animate-ping' : 'bg-gray-400'}`}></div>
              </div>
            </div>
          </div>
          
          {/* Flash - Lightning bolt */}
          <div className={`absolute -top-1 -right-1 w-4 h-4 ${isCenter ? 'w-6 h-6' : 'w-4 h-4'} rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center shadow-[0_0_10px_rgba(255,215,0,0.8)]`}>
            <svg 
              className={`${isCenter ? 'w-3 h-3' : 'w-2 h-2'} text-white drop-shadow-sm`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        {/* Glow effects for center button */}
        {isCenter && (
          <>
            <div className="absolute -inset-4 bg-pink-400/20 rounded-full blur-lg animate-pulse"></div>
            <div className="absolute -inset-6 bg-pink-400/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </>
        )}
        
        {/* Active state glow */}
        {isActive && !isCenter && (
          <div className="absolute -inset-2 bg-pink-400/30 rounded-lg blur-sm"></div>
        )}
      </div>
    );
  };

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

  // Side navigation items (left and right)
  const sideNavigationItems = [
    {
      title: "AI Chat",
      subtitle: "Get expert growing advice",
      to: "/chat",
      icon: ChatIcon,
      label: "AI Chat"
    },
    {
      title: "Growing Guide",
      subtitle: "Quick answers to FAQs",
      to: "/grow-guide",
      icon: GuideIcon,
      label: "Guide"
    },
  ];

  const isPlantHealthActive = location.pathname === '/plant-health';
  const isSettingsActive = location.pathname === '/settings';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black backdrop-blur-lg border-t border-emerald-500/20 shadow-[0_-10px_40px_-10px_rgba(0,255,127,0.3)]">
      {/* Futuristic edge effect */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
      
      <div className="relative px-4 py-6">
        <div className="flex justify-between items-center max-w-sm mx-auto">
          {/* Left side - AI Chat and Guide */}
          <div className="flex gap-4">
            {sideNavigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              
              return (
                <button
                  key={item.to}
                  onClick={() => navigate(item.to)}
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

          {/* Center - Plant Health Floating Action Button */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-8">
            <button
              onClick={() => {
                navigate('/plant-health');
                // Trigger camera after navigation
                setTimeout(() => {
                  const event = new CustomEvent('trigger-camera-capture');
                  window.dispatchEvent(event);
                }, 100);
              }}
              className={`relative p-6 rounded-full transition-all duration-300 group ${
                isPlantHealthActive 
                  ? 'bg-gradient-to-br from-pink-400 to-red-500 shadow-[0_0_40px_rgba(255,20,147,0.8)] scale-110' 
                  : 'bg-gradient-to-br from-pink-300 to-red-400 shadow-[0_0_25px_rgba(255,20,147,0.5)] hover:scale-105 hover:shadow-[0_0_35px_rgba(255,20,147,0.7)]'
              }`}
            >
              {/* Floating glow rings */}
              <div className="absolute -inset-8 bg-pink-400/20 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -inset-6 bg-pink-400/30 rounded-full blur-lg animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              
              <PlantIcon isActive={isPlantHealthActive} isCenter={true} />
              
              {/* Center button label */}
              <span className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold transition-all duration-300 ${
                isPlantHealthActive 
                  ? 'text-pink-300 drop-shadow-[0_0_8px_rgba(255,20,147,0.8)]' 
                  : 'text-white group-hover:text-pink-200 group-hover:drop-shadow-[0_0_6px_rgba(255,20,147,0.6)]'
              }`} style={{
                fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                textShadow: isPlantHealthActive ? '0 0 12px rgba(255,20,147,0.8)' : 'none'
              }}>
                Plant Health
              </span>
            </button>
          </div>

          {/* Right side - Settings */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/settings')}
              className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                isSettingsActive
                  ? 'bg-gradient-to-t from-black to-gray-900 shadow-[0_0_20px_rgba(138,43,226,0.4)] border border-purple-500/30' 
                  : 'bg-gradient-to-t from-gray-900/50 to-gray-800/50 hover:bg-gradient-to-t hover:from-gray-900 hover:to-gray-800 hover:shadow-[0_0_15px_rgba(138,43,226,0.3)] hover:border hover:border-purple-500/20'
              }`}
            >
              {/* Hover glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-t from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isSettingsActive ? 'opacity-30' : ''}`}></div>
              
              <SettingsIcon isActive={isSettingsActive} />
              <span className={`text-xs font-medium mt-2 relative z-10 transition-all duration-300 ${
                isSettingsActive
                  ? 'text-purple-300 font-semibold drop-shadow-[0_0_6px_rgba(138,43,226,0.8)]' 
                  : 'text-white group-hover:text-purple-200 group-hover:drop-shadow-[0_0_4px_rgba(138,43,226,0.4)]'
              }`} style={{
                fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                textShadow: isSettingsActive ? '0 0 10px rgba(138,43,226,0.5)' : 'none'
              }}>
                Settings
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
