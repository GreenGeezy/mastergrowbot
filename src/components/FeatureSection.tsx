
import React from "react";
import { MessageCircle, Camera, BookOpen, Settings } from "lucide-react";
import { motion } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface FeatureSectionProps {
  onFeatureClick: () => void;
}

const FeatureSection = React.memo(({ onFeatureClick }: FeatureSectionProps) => {
  return (
    <div className="w-full max-w-screen-md mx-auto px-4">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          Welcome to Master Growbot
        </h2>
        <p className="text-gray-400">
          Your AI-powered cannabis cultivation assistant. Use the sidebar navigation to explore all features.
        </p>
      </div>
    </div>
  );
});

FeatureSection.displayName = 'FeatureSection';

export default FeatureSection;
