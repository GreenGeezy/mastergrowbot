import React from 'react';

const PlantHealthHeader = () => {
  return (
    <div className="text-center space-y-4 mb-8">
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
  );
};

export default PlantHealthHeader;