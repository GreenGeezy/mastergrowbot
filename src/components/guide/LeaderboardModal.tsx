import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { upsertLeaderboardProfile } from '@/integrations/supabase/client';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialName: string;
}

// Collapse whitespace, remove control chars, limit emoji, enforce length 2–20
const sanitizeName = (name: string) => {
  // Remove control characters
  let cleaned = name.replace(/[\p{Cc}\p{Cf}]/gu, '');
  // Collapse inner spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  return cleaned;
};

const countEmoji = (str: string) => {
  // Basic emoji regex (not exhaustive, but good enough for client-side)
  const emojiRegex = /([\u203C-\u3299\u1F000-\u1FAFF\u1F300-\u1F6FF\u1F900-\u1F9FF\u2600-\u27BF])/gu;
  return (str.match(emojiRegex) || []).length;
};

const isValidChars = (str: string) => {
  // Allow letters, numbers, spaces, and common emoji; block other symbols/control
  // We allow punctuation minimally: hyphen and apostrophe for names
  const invalid = /[^\p{L}\p{N} \-\'\u203C-\u3299\u1F000-\u1FAFF\u1F300-\u1F6FF\u1F900-\u1F9FF\u2600-\u27BF]/gu;
  return !invalid.test(str);
};

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose, initialName }) => {
  const [name, setName] = useState(initialName || '');
  const [optIn, setOptIn] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setName(initialName || '');
  }, [initialName, isOpen]);

  const onSave = async () => {
    const cleaned = sanitizeName(name);

    if (!isValidChars(cleaned)) {
      toast({
        title: 'Invalid characters',
        description: 'Use letters, numbers, spaces, and basic emoji only.',
        variant: 'destructive',
      });
      return;
    }

    if (cleaned.length < 2 || cleaned.length > 20) {
      toast({
        title: 'Name length must be 2–20 characters',
        description: 'Please adjust your leaderboard name.',
        variant: 'destructive',
      });
      return;
    }

    if (countEmoji(cleaned) > 2) {
      toast({
        title: 'Too many emoji',
        description: 'Limit your leaderboard name to at most 2 emoji.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);
      const saved = await upsertLeaderboardProfile({ leaderboard_name: cleaned, is_opt_in: optIn });
      if (!saved) throw new Error('Save failed');

      toast({
        title: optIn ? "You're on the board—boost daily to climb!" : 'You left the leaderboard.',
      });

      onClose();
    } catch (e) {
      console.error('Leaderboard save error', e);
      toast({
        title: "Couldn't update your leaderboard settings.",
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        role="dialog"
        aria-label="Edit leaderboard settings"
        className="rounded-2xl p-4 md:p-6 shadow-card"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit leaderboard settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="leaderboard-name">Leaderboard Name</Label>
            <Input
              id="leaderboard-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. GreenThumb"
              maxLength={24}
            />
            <p className="text-xs text-muted-foreground">
              Shown publicly on the board. You can change or leave anytime.
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="opt-in">Show me on the public leaderboard</Label>
              <p className="text-xs text-muted-foreground">Toggle to opt in or out any time.</p>
            </div>
            <Switch id="opt-in" checked={optIn} onCheckedChange={setOptIn} />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-3">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white">
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaderboardModal;
