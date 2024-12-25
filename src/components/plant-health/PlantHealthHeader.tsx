import React from 'react';
import { Leaf } from 'lucide-react';

const PlantHealthHeader = () => {
  return (
    <div className="text-center space-y-6 mb-12">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-primary to-secondary rounded-lg">
          <Leaf className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
          Master Growbot
        </h2>
      </div>
      
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Plant Health Scanner
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto px-4">
          Upload photos of your plant for instant AI-powered analysis. Get insights on health issues, nutrient deficiencies, and personalized care recommendations.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Instant Analysis
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Expert Insights
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            Care Tips
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlantHealthHeader;