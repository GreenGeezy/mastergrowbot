import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SupportDialog from '@/components/support/SupportDialog';

export const ChatHeader = () => {
  const [showSupport, setShowSupport] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b border-[#333333] bg-[#1A1A1A]">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/a72be8e9-0fb6-49e8-985d-127ba951fee7.png" 
            alt="Master Growbot Logo" 
            className="w-10 h-10 rounded-full"
          />
          <h1 className="text-xl font-semibold text-white">Master Growbot</h1>
        </div>
        <Button 
          variant="secondary" 
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => setShowSupport(true)}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Share Feedback
        </Button>
      </div>
      <SupportDialog isOpen={showSupport} onOpenChange={setShowSupport} />
    </>
  );
};