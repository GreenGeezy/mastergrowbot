import React from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const UserDashboard = () => {
  return (
    <div className="w-full max-w-md mx-auto animate-fade-in px-4">
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#33C3F0]">
          Welcome back!
        </h2>
        <Button
          onClick={() => supabase.auth.signOut()}
          className="bg-gradient-to-r from-primary to-[#33C3F0] hover:opacity-90 text-white font-medium px-8 py-2 rounded-lg transform hover:scale-105 transition-all duration-300"
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default UserDashboard;