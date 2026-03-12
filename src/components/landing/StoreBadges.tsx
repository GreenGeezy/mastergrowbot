import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface StoreBadgesProps {
  className?: string;
}

export default function StoreBadges({ className = '' }: StoreBadgesProps) {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleIosClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('waitlist').insert({
        email: email.trim(),
        name: 'iOS Waitlist',
      });

      if (error) {
        if (error.code === '23505') {
          toast({ title: "You're already on the list!", description: "We'll notify you when the iOS app is ready." });
        } else {
          throw error;
        }
      } else {
        toast({ title: 'Success!', description: "We'll let you know when the iOS app is ready." });
      }

      setEmail('');
      setShowModal(false);
    } catch (err) {
      console.error('Waitlist error:', err);
      toast({ title: 'Something went wrong', description: 'Please try again later.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`flex flex-col sm:flex-row items-center gap-4 ${className}`}>
        <motion.button
          onClick={handleIosClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="group relative bg-transparent border-none cursor-pointer p-0"
        >
          <div className="absolute -inset-1 bg-landing-green/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <img
            src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
            alt="Download on the App Store"
            className="relative h-[65px] sm:h-[70px]"
          />
        </motion.button>

        <motion.a
          href="https://play.google.com/store/apps/details?id=com.mastergrowbot.app&pcampaignid=web_share"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="group relative"
        >
          <div className="absolute -inset-1 bg-landing-green/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <img
            src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
            alt="Get it on Google Play"
            className="relative h-[65px] sm:h-[70px]"
          />
        </motion.a>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-card border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              🍎 Coming Soon!
            </DialogTitle>
            <DialogDescription className="text-center text-white/60">
              The iOS app is almost ready. Enter your email and we'll let you know when it's available!
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-landing-green hover:bg-landing-green/90 text-black font-semibold"
            >
              {loading ? 'Submitting...' : 'Notify Me'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
