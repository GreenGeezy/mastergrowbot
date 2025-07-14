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
        <img 
          src={plantComparisonImage}
          alt="Plant health comparison: unhealthy vs healthy cannabis plants"
          className="w-full h-48 sm:h-56 object-cover"
          loading="lazy"
        />
        
        {/* Overlay labels */}
        <div className="absolute inset-0 flex">
          <div className="flex-1 flex items-end p-3">
            <div className="bg-red-500/90 text-white text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm">
              Before
            </div>
          </div>
          <div className="flex-1 flex items-end justify-end p-3">
            <div className="bg-green-500/90 text-white text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm">
              After
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