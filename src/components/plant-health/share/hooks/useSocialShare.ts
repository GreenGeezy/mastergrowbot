import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SharePlatform } from '../types';

export const useSocialShare = () => {
  const { toast } = useToast();

  const trackShare = async (analysisId: string, platform: SharePlatform) => {
    await supabase
      .from('share_metrics')
      .insert({
        analysis_id: analysisId,
        share_type: platform,
      });
  };

  const handleSocialShare = async (
    url: string, 
    platform: SharePlatform, 
    analysisId: string,
    customConfig?: {
      text?: string;
      mobileAppUrl?: string;
      webFallbackUrl?: string;
    }
  ) => {
    await trackShare(analysisId, platform);
    
    const defaultText = "Check out my plant analysis from Master Growbot! Grow Bigger, Grow Better with AI-powered plant analysis";
    const text = customConfig?.text || defaultText;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'instagram':
      case 'tiktok':
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isMobile && customConfig?.mobileAppUrl) {
          window.location.href = customConfig.mobileAppUrl;
          setTimeout(() => {
            window.location.href = customConfig.webFallbackUrl || url;
          }, 2000);
        } else {
          window.open(customConfig?.webFallbackUrl || url, '_blank');
        }
        toast({
          title: `Opening ${platform}`,
          description: `The link has been copied to your clipboard. You can paste it in your ${platform} post.`,
        });
        break;
      case 'email':
        const subject = "Check out my plant analysis from Master Growbot!";
        const body = "I wanted to share this plant analysis with you from Master Growbot. Check it out here: " + url;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        break;
    }
  };

  return {
    handleSocialShare
  };
};