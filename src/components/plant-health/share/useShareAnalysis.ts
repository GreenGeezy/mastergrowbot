import { useState } from 'react';
import { Link2, Mail, Twitter, Instagram, Video, Facebook, Linkedin } from 'lucide-react';
import { useShareToken } from './hooks/useShareToken';
import { useSocialShare } from './hooks/useSocialShare';
import type { ShareOption } from './types';

export const useShareAnalysis = (analysisId: string, imageUrls: string[]) => {
  const [isOpen, setIsOpen] = useState(false);
  const { createShareableLink, isLoading } = useShareToken(analysisId);
  const { handleSocialShare } = useSocialShare();

  const shareOptions: ShareOption[] = [
    {
      icon: Link2,
      label: "Copy Link",
      action: async () => {
        await createShareableLink();
      }
    },
    {
      icon: Facebook,
      label: "Share on Facebook",
      action: async () => {
        const url = await createShareableLink();
        await handleSocialShare(url, 'facebook', analysisId);
      }
    },
    {
      icon: Linkedin,
      label: "Share on LinkedIn",
      action: async () => {
        const url = await createShareableLink();
        await handleSocialShare(url, 'linkedin', analysisId);
      }
    },
    {
      icon: Twitter,
      label: "Share on X/Twitter",
      action: async () => {
        const url = await createShareableLink();
        await handleSocialShare(url, 'twitter', analysisId);
      }
    },
    {
      icon: Instagram,
      label: "Share on Instagram",
      action: async () => {
        const url = await createShareableLink();
        await handleSocialShare(url, 'instagram', analysisId, {
          mobileAppUrl: `instagram://share?text=Check out my plant analysis from Master Growbot!%0A${encodeURIComponent(url)}`,
          webFallbackUrl: 'https://www.instagram.com'
        });
      }
    },
    {
      icon: Video,
      label: "Share on TikTok",
      action: async () => {
        const url = await createShareableLink();
        await handleSocialShare(url, 'tiktok', analysisId, {
          mobileAppUrl: `tiktok://share?text=Check out my plant analysis from Master Growbot!%0A${encodeURIComponent(url)}`,
          webFallbackUrl: 'https://www.tiktok.com/upload'
        });
      }
    },
    {
      icon: Mail,
      label: "Share via Email",
      action: async () => {
        const url = await createShareableLink();
        await handleSocialShare(url, 'email', analysisId);
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