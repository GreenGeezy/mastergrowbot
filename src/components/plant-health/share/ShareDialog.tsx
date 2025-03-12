
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import type { ShareOption } from './types';

interface ShareDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  shareOptions: ShareOption[];
  isLoading: boolean;
  title?: string;
  description?: string;
}

const ShareDialog = ({ 
  isOpen, 
  onOpenChange, 
  shareOptions, 
  isLoading,
  title = "Share Analysis Results",
  description = "Choose how you want to share your plant analysis results"
}: ShareDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">{title}</DialogTitle>
          <DialogDescription className="text-gray-400 text-center">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 bg-gray-800/50 rounded-lg mb-4 border border-gray-700">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <img 
                src="/lovable-uploads/a72be8e9-0fb6-49e8-985d-127ba951fee7.png" 
                alt="Master Growbot" 
                className="w-6 h-6"
              />
            </div>
            <div className="font-medium">Master Growbot Analysis</div>
          </div>
          <div className="text-sm text-gray-300">
            Check out my plant analysis from Master Growbot! Get AI-powered insights for your own plants.
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-2">
          {shareOptions.map((option, index) => (
            <Button
              key={index}
              onClick={option.action}
              className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <option.icon className="h-4 w-4" />
              )}
              <span>{option.label}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
