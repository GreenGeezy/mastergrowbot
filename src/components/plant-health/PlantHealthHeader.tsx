import React from 'react';
const PlantHealthHeader = () => {
  return <div className="text-center mb-8 animate-fade-in bg-white">
      <div className="flex items-center justify-center max-w-6xl mx-auto mb-4">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-600 via-green-500 to-green-700 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          <a href="https://www.mastergrowbot.com" className="block">
            <div className="relative bg-gray-100 p-4 rounded-full backdrop-blur-xl ring-1 ring-gray-200 hover:ring-green-300 transition-all duration-500">
              <img src="/lovable-uploads/c346bc72-2133-49aa-a5c8-b0773e68ef3b.png" alt="Master Growbot - AI Cannabis Cultivation Assistant" className="w-16 h-16" />
            </div>
          </a>
        </div>
      </div>
      <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 via-green-500 to-green-700 text-transparent bg-clip-text">
        Plant Health Scanner
      </h1>
      <p className="text-center text-gray-950 text-xl">Take a pic or Upload images of your plant for an instant AI-powered health analysis with<br />
Customized Recommended Actions to grow bigger better buds!</p>
    </div>;
};
export default PlantHealthHeader;