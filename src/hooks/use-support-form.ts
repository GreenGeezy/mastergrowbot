import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface SupportFormData {
  name: string;
  email: string;
  title: string;
  message: string;
}

export const useSupportForm = (onSuccess: () => void) => {
  const [formData, setFormData] = useState<SupportFormData>({
    name: "",
    email: "",
    title: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('support_messages')
        .insert([{ 
          ...formData,
          status: 'new'
        }]);

      if (error) throw error;

      toast({
        title: "Message Sent",
        description: "We'll get back to you as soon as possible!",
      });

      setFormData({
        name: "",
        email: "",
        title: "",
        message: "",
      });
      
      onSuccess();
    } catch (error: any) {
      console.error("Support message error:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    isLoading,
    handleSubmit,
  };
};