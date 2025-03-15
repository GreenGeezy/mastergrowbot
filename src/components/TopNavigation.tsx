
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { Brain, Seedling, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import FeatureCard from './FeatureCard';
import { ProfileDropdown } from './profile/ProfileDropdown';

export const TopNavigation: React.FC = () => {
  const session = useSession();
  const location = useLocation();

  const handleFeatureClick = () => {
    if (!session) {
      toast.error('Please sign in to access this feature');
      return;
    }
  };

  // Skip rendering navigation on landing page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <div className="w-full flex justify-between items-center p-3 border-b border-[#333333] bg-gradient-to-r from-[#1A1F2C]/80 to-[#222222]/90 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-glow via-accent-glow to-secondary-glow rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
            <div className="relative bg-card p-1 rounded-full backdrop-blur-xl ring-1 ring-white/10 hover:ring-accent/30 transition-all duration-500">
              <img 
                src="/lovable-uploads/4e06e426-6ad3-48aa-a7bd-99c3e78d0c74.png" 
                alt="Master Growbot Logo" 
                className="h-10 w-10 transform group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
          </div>
          <span className="ml-2 text-lg font-semibold text-white hidden md:block">Master Growbot</span>
        </Link>
      </div>

      <div className="flex-1 flex justify-center gap-3 max-w-md mx-auto">
        <FeatureCard
          icon={Brain}
          title="Growing Assistant"
          subtitle="Get expert advice"
          to="/chat"
        />
        <FeatureCard
          icon={Seedling}
          title="Plant Health Check"
          subtitle="Diagnose issues"
          to="/plant-health"
        />
        <FeatureCard
          icon={BookOpen}
          title="Growing Guide"
          subtitle="Quick answers to FAQs"
          to="/grow-guide"
        />
      </div>

      <div className="flex items-center">
        {session ? (
          <ProfileDropdown />
        ) : (
          <Link to="/">
            <button className="px-3 py-1 bg-primary rounded text-white hover:bg-primary-hover text-sm">
              Log In
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default TopNavigation;
