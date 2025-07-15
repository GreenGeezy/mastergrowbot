import React from "react";
import { motion } from "framer-motion";
import plantComparisonImage from "@/assets/plant-comparison.jpg";

const PlantComparison = () => {
  return (
    <motion.div 
      className="relative w-full max-w-md mx-auto mb-6 sm:mb-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="relative overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
        <div className="flex h-48 sm:h-56">
          {/* Before - Unhealthy plant */}
          <div className="flex-1 relative">
            <img 
              src="/lovable-uploads/37fbd4d7-6755-483d-a310-123a53b63f9f.png"
              alt="Unhealthy cannabis plant"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-3 left-3">
              <div className="bg-red-500/90 text-white text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm">
                Before
              </div>
            </div>
          </div>
          
          {/* After - Healthy plant */}
          <div className="flex-1 relative">
            <img 
              src={plantComparisonImage}
              alt="Healthy cannabis plant"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-3 right-3">
              <div className="bg-green-500/90 text-white text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm">
                After
              </div>
            </div>
          </div>
        </div>
        
        {/* Divider line */}
        <div className="absolute top-0 left-1/2 w-0.5 h-full bg-white/20 transform -translate-x-0.5" />
      </div>
    </motion.div>
  );
};

export default PlantComparison;