import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { nanoid } from 'nanoid';
import { addDays } from 'date-fns';
import { Share2, Mail, Twitter, Link2 } from 'lucide-react';
import type { ShareOption } from './types';

export const useShareAnalysis = (analysisId: string, imageUrls: string[]) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateShareToken = () => nanoid(32);

  const createShareableLink = async () => {
    try {
      setIsLoading(true);
      
      // Generate a unique share token
      const shareToken = generateShareToken();
      const expiresAt = addDays(new Date(), 7);

      // Create the shared analysis record
      const { error: shareError } = await supabase
        .from('shared_analyses')
        .insert({
          analysis_id: analysisId,
          share_token: shareToken,
          expires_at: expiresAt.toISOString(),
        });

      if (shareError) throw shareError;

      // Track sharing metrics
      await supabase
        .from('share_metrics')
        .insert({
          analysis_id: analysisId,
          share_type: 'link',
        });

      const shareableUrl = `${window.location.origin}/shared/${shareToken}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareableUrl);
      
      toast({
        title: "Link copied to clipboard!",
        description: "You can now share this analysis with anyone.",
      });

      return shareableUrl;
    } catch (error: any) {
      console.error('Error creating shareable link:', error);
      toast({
        title: "Failed to create shareable link",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const shareOptions: ShareOption[] = [
    {
      icon: Link2,
      label: "Copy Link",
      action: async () => {
        await createShareableLink();
      }
    },
    {
      icon: Twitter,
      label: "Share on X/Twitter",
      action: async () => {
        const url = await createShareableLink();
        const text = "Check out my plant analysis from Master Growbot! Grow Bigger, Grow Better with AI-powered plant analysis";
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
      }
    },
    {
      icon: Mail,
      label: "Share via Email",
      action: async () => {
        const url = await createShareableLink();
        const subject = "Check out my plant analysis from Master Growbot!";
        const body = "I wanted to share this plant analysis with you from Master Growbot. Check it out here: " + url;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      }
    }
  ];

  return {
    isOpen,
    setIsOpen,
    isLoading,
    shareOptions,
  };
};