import { useState, useEffect } from "react";
import { useSession } from '@supabase/auth-helpers-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { LoaderCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SupportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const SupportDialog = ({ isOpen, onOpenChange }: SupportDialogProps) => {
  const session = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Auto-populate fields from user session
  useEffect(() => {
    if (session?.user && isOpen) {
      setEmail(session.user.email || '');
      
      // Try to get name from user metadata or profile
      const loadUserName = async () => {
        try {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('username')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (profile?.username) {
            setName(profile.username);
          } else if (session.user.user_metadata?.name) {
            setName(session.user.user_metadata.name);
          }
        } catch (error) {
          console.warn('Could not load user name:', error);
        }
      };

      loadUserName();
    }
  }, [session, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form fields
    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Valid Email Required",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a message title.",
        variant: "destructive",
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter your message.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check for existing session if user is logged in
      if (session) {
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.warn('Session check failed, proceeding anonymously:', sessionError);
        }
      }

      console.log("Submitting support message...");
      
      // Retry logic for network issues
      const submitWithRetry = async (retries = 3) => {
        for (let i = 0; i < retries; i++) {
          try {
            const { error } = await supabase
              .from('support_messages')
              .insert({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                title: title.trim(),
                message: message.trim(),
                status: 'new'
              });

            if (error) throw error;
            return; // Success
          } catch (error: any) {
            if (i === retries - 1) throw error; // Last retry failed
            
            console.warn(`Retry ${i + 1} failed:`, error);
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Progressive delay
          }
        }
      };

      await submitWithRetry();

      toast({
        title: "Message Sent Successfully!",
        description: "We'll get back to you as soon as possible.",
      });

      // Reset form and close dialog
      setName("");
      setEmail("");
      setTitle("");
      setMessage("");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Support message error:", error);
      
      let errorMessage = "Failed to send message. Please try again.";
      
      if (error.message?.includes('violates row-level security')) {
        errorMessage = "Permission error. Please refresh the page and try again.";
      } else if (error.message?.includes('network') || error.code === 'NETWORK_ERROR') {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error.message?.includes('duplicate')) {
        errorMessage = "Duplicate message detected. Please wait before sending again.";
      }
      
      toast({
        title: "Error Sending Message",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-900 border border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-gold text-base">Share Your Ideas & Feedback to Help Master Growbot keep it's Title as the Best AI Cannabis Growing Assistant in the World!</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div>
            <Input
              placeholder="Message Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div>
            <Textarea
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SupportDialog;