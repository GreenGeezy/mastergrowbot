import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Link, Copy, Mail, Twitter, Instagram } from 'lucide-react';
import { ShareOption } from './types';

export const useShareAnalysis = (analysisId: string, imageUrls: string[]) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const recordShareMetric = async (shareType: string) => {
    try {
      await supabase
        .from('share_metrics')
        .insert({
          analysis_id: analysisId,
          share_type: shareType,
        });
    } catch (error) {
      console.error('Error recording share metric:', error);
    }
  };

  const generateShareableUrl = async (): Promise<string> => {
    try {
      const { data: shareData, error: shareError } = await supabase
        .from('shared_analyses')
        .insert({
          analysis_id: analysisId,
          share_token: crypto.randomUUID(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        })
        .select('share_token')
        .single();

      if (shareError) throw shareError;

      return `${window.location.origin}/shared/${shareData.share_token}`;
    } catch (error) {
      console.error('Error generating shareable URL:', error);
      throw error;
    }
  };

  const copyToClipboard = async () => {
    setIsLoading(true);
    try {
      const shareableUrl = await generateShareableUrl();
      await navigator.clipboard.writeText(shareableUrl);
      await recordShareMetric('copy_link');
      toast({
        title: "Link Copied!",
        description: "The shareable link has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate shareable link.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyImageToClipboard = async () => {
    setIsLoading(true);
    try {
      const { data } = await supabase
        .storage
        .from('plant-images')
        .createSignedUrl(imageUrls[0], 60 * 60);

      if (!data?.signedUrl) throw new Error('Failed to generate image URL');

      const response = await fetch(data.signedUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      await recordShareMetric('copy_image');
      toast({
        title: "Image Copied!",
        description: "The analysis image has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy image. Try using the link instead.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const shareViaEmail = async () => {
    setIsLoading(true);
    try {
      const shareableUrl = await generateShareableUrl();
      const subject = encodeURIComponent('Check out my plant health analysis');
      const body = encodeURIComponent(`I wanted to share my plant health analysis with you: ${shareableUrl}`);
      await recordShareMetric('email');
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate email link.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const shareViaTwitter = async () => {
    setIsLoading(true);
    try {
      const shareableUrl = await generateShareableUrl();
      const text = encodeURIComponent('Check out my plant health analysis from @MasterGrowbot');
      await recordShareMetric('twitter');
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareableUrl)}`, '_blank');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share on Twitter.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const shareViaInstagram = async () => {
    setIsLoading(true);
    try {
      const shareableUrl = await generateShareableUrl();
      await recordShareMetric('instagram');
      await navigator.clipboard.writeText(shareableUrl);
      toast({
        title: "Ready to Share on Instagram",
        description: "Link copied! Open Instagram and paste in your story or direct message.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to prepare Instagram share.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const shareOptions: ShareOption[] = [
    { icon: Link, label: 'Copy Link', action: copyToClipboard },
    { icon: Copy, label: 'Copy Image', action: copyImageToClipboard },
    { icon: Mail, label: 'Email', action: shareViaEmail },
    { icon: Twitter, label: 'Twitter', action: shareViaTwitter },
    { icon: Instagram, label: 'Instagram', action: shareViaInstagram },
  ];

  return {
    isOpen,
    setIsOpen,
    isLoading,
    shareOptions,
  };
};