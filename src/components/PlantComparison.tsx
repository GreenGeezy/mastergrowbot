import React from "react";
import { motion } from "framer-motion";
import healthyCannabisPlant from "@/assets/healthy-cannabis-plant.jpg";

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
          <motion.div 
            className="flex-1 relative"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <img 
              src="/lovable-uploads/37fbd4d7-6755-483d-a310-123a53b63f9f.png"
              alt="Unhealthy cannabis plant"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <motion.div 
              className="absolute bottom-3 left-3"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              <div className="bg-red-500/90 text-white text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm">
                Before
              </div>
            </motion.div>
          </motion.div>
          
          {/* After - Healthy plant */}
          <motion.div 
            className="flex-1 relative"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <img 
              src={healthyCannabisPlant}
              alt="Healthy cannabis plant"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <motion.div 
              className="absolute bottom-3 right-3"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.9 }}
            >
              <div className="bg-green-500/90 text-white text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm">
                After
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Animated divider line */}
        <motion.div 
          className="absolute top-0 left-1/2 w-0.5 bg-white/20 transform -translate-x-0.5"
          initial={{ height: 0 }}
          animate={{ height: "100%" }}
          transition={{ duration: 0.6, delay: 0.4 }}
        />
      </div>
    </motion.div>
  );
};

export default PlantComparison;