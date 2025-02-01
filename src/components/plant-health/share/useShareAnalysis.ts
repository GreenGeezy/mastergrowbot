import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { nanoid } from 'nanoid';
import { addDays } from 'date-fns';
import { Share2, Mail, Twitter, Link2, Instagram, Video, Facebook, Linkedin } from 'lucide-react';
import type { ShareOption } from './types';
import { useIsMobile } from '@/hooks/use-mobile';

export const useShareAnalysis = (analysisId: string, imageUrls: string[]) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const generateShareToken = () => nanoid(32);

  const createShareableLink = async () => {
    if (!analysisId) {
      toast({
        title: "Error",
        description: "No analysis to share",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const shareToken = generateShareToken();
      const expiresAt = addDays(new Date(), 7);

      const { error: shareError } = await supabase
        .from('shared_analyses')
        .insert({
          analysis_id: analysisId,
          share_token: shareToken,
          expires_at: expiresAt.toISOString(),
        });

      if (shareError) throw shareError;

      const shareableUrl = `${window.location.origin}/shared/${shareToken}`;
      
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

  const handleMobileShare = async () => {
    try {
      const url = await createShareableLink();
      if (!url) return;

      if (navigator.share) {
        await navigator.share({
          title: 'Plant Analysis Results',
          text: 'Check out my plant analysis from Master Growbot!',
          url
        });
        
        // Log the share metric
        await supabase
          .from('share_metrics')
          .insert({
            analysis_id: analysisId,
            share_type: 'mobile_share',
          });

        toast({
          title: "Success!",
          description: "Thanks for sharing your analysis.",
        });
      } else {
        // Fallback for browsers that don't support navigator.share
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied!",
          description: "Share URL has been copied to your clipboard.",
        });
      }
    } catch (error: any) {
      console.error('Error sharing:', error);
      toast({
        title: "Sharing failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const shareOptions: ShareOption[] = [
    {
      icon: Link2,
      label: "Copy Link",
      action: createShareableLink
    },
    {
      icon: Facebook,
      label: "Share on Facebook",
      action: async () => {
        const url = await createShareableLink();
        await supabase
          .from('share_metrics')
          .insert({
            analysis_id: analysisId,
            share_type: 'facebook',
          });
        
        if (isMobile) {
          window.location.href = `fb://share?u=${encodeURIComponent(url)}`;
        } else {
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
        }
      }
    },
    {
      icon: Linkedin,
      label: "Share on LinkedIn",
      action: async () => {
        const url = await createShareableLink();
        await supabase
          .from('share_metrics')
          .insert({
            analysis_id: analysisId,
            share_type: 'linkedin',
          });
        
        if (isMobile) {
          window.location.href = `linkedin://shareArticle?mini=true&url=${encodeURIComponent(url)}`;
        } else {
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
        }
      }
    },
    {
      icon: Twitter,
      label: "Share on X/Twitter",
      action: async () => {
        const url = await createShareableLink();
        const text = "Check out my plant analysis from Master Growbot!";
        if (isMobile) {
          window.location.href = `twitter://post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        } else {
          window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        }
      }
    },
    {
      icon: Instagram,
      label: "Share on Instagram",
      action: async () => {
        const url = await createShareableLink();
        await supabase
          .from('share_metrics')
          .insert({
            analysis_id: analysisId,
            share_type: 'instagram',
          });
        
        if (isMobile) {
          window.location.href = `instagram://share?text=Check out my plant analysis from Master Growbot!%0A${encodeURIComponent(url)}`;
        } else {
          window.open('https://www.instagram.com', '_blank');
        }
        
        toast({
          title: "Opening Instagram",
          description: "The link has been copied to your clipboard. You can paste it in your Instagram post.",
        });
      }
    },
    {
      icon: Video,
      label: "Share on TikTok",
      action: async () => {
        const url = await createShareableLink();
        await supabase
          .from('share_metrics')
          .insert({
            analysis_id: analysisId,
            share_type: 'tiktok',
          });
        
        if (isMobile) {
          window.location.href = `tiktok://share?text=Check out my plant analysis from Master Growbot!%0A${encodeURIComponent(url)}`;
        } else {
          window.open('https://www.tiktok.com/upload', '_blank');
        }
        
        toast({
          title: "Opening TikTok",
          description: "The link has been copied to your clipboard. You can paste it in your TikTok video description.",
        });
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
    handleMobileShare
  };
};