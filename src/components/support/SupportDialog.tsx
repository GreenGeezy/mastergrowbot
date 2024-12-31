import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSupportForm } from "@/hooks/use-support-form";
import SupportForm from "./SupportForm";

interface SupportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const SupportDialog = ({ isOpen, onOpenChange }: SupportDialogProps) => {
  const { formData, setFormData, isLoading, handleSubmit } = useSupportForm(() => onOpenChange(false));

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-900 border border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Contact Support</DialogTitle>
        </DialogHeader>
        <SupportForm
          formData={formData}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onChange={handleFieldChange}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SupportDialog;