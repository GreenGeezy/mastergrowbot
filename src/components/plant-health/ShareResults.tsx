import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Share2, Link, Mail, Twitter } from 'lucide-react';
import { LoaderCircle } from 'lucide-react';

interface ShareOption {
  icon: React.ElementType;
  label: string;
  action: () => Promise<void>;
}

interface ShareResultsProps {
  analysisId: string;
  imageUrls: string[];
}

const ShareResults = ({ analysisId, imageUrls }: ShareResultsProps) => {
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
    const { data } = await supabase
      .storage
      .from('plant-images')
      .createSignedUrl(imageUrls[0], 60 * 60); // 1 hour expiry

    return data?.signedUrl || '';
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

  const shareViaWhatsApp = async () => {
    setIsLoading(true);
    try {
      const shareableUrl = await generateShareableUrl();
      const text = encodeURIComponent('Check out my plant health analysis from Master Growbot: ');
      await recordShareMetric('whatsapp');
      window.open(`https://wa.me/?text=${text}${encodeURIComponent(shareableUrl)}`, '_blank');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share on WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const shareOptions: ShareOption[] = [
    { icon: Link, label: 'Copy Link', action: copyToClipboard },
    { icon: Mail, label: 'Email', action: shareViaEmail },
    { icon: Twitter, label: 'Twitter', action: shareViaTwitter },
    { icon: Share2, label: 'WhatsApp', action: shareViaWhatsApp },
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Analysis Results</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {shareOptions.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="flex items-center gap-2 p-4"
                onClick={() => option.action()}
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                ) : (
                  <option.icon className="h-5 w-5" />
                )}
                {option.label}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <div
        onClick={() => setIsOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsOpen(true);
          }
        }}
        className="group flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 hover:bg-[#333333] border border-[#333333] hover:border-primary/50"
      >
        <div className="p-1.5 bg-gradient-to-r from-primary to-[#33C3F0] rounded-lg">
          <Share2 className="w-4 h-4 text-white" />
        </div>
        <div className="ml-3 flex flex-col">
          <h3 className="font-medium text-sm text-white group-hover:text-[#33C3F0] transition-colors duration-300">
            Share Results
          </h3>
          <p className="text-gray-400 text-xs">
            Share your analysis via email, social media, or copy a direct link
          </p>
        </div>
      </div>
    </>
  );
};

export default ShareResults;