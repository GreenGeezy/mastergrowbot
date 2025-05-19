
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface PurchaseNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PurchaseNotificationModal = ({
  isOpen,
  onClose,
}: PurchaseNotificationModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Purchase Required</DialogTitle>
          <DialogDescription className="text-center">
            New customer? Purchase first — you'll get a special sign-up link.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4 pt-4">
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
          <Button
            variant="outline" 
            onClick={() => window.location.href = "https://www.mastergrowbot.com"}
            className="w-full"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Go to Purchase Page
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseNotificationModal;
