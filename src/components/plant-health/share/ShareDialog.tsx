import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LoaderCircle, Link, Copy, Mail, Twitter, Instagram } from 'lucide-react';
import { ShareOption } from './types';

interface ShareDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  shareOptions: ShareOption[];
  isLoading: boolean;
}

const ShareDialog = ({ isOpen, onOpenChange, shareOptions, isLoading }: ShareDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-900 border border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Share Analysis Results</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {shareOptions.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className="flex items-center gap-2 p-4 bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
              onClick={() => option.action()}
              disabled={isLoading}
            >
              {isLoading ? (
                <LoaderCircle className="h-5 w-5 animate-spin" />
              ) : (
                <option.icon className="h-5 w-5" />
              )}
              {option.label}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;