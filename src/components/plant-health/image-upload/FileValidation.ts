import { useToast } from '@/hooks/use-toast';

export const useFileValidation = () => {
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload JPEG, PNG, or WebP images only.",
        variant: "destructive",
      });
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Each image must be smaller than 10MB.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  return { validateFile };
};