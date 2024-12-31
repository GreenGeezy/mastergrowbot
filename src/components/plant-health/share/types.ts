import { LucideIcon } from 'lucide-react';

export type SharePlatform = 'facebook' | 'linkedin' | 'twitter' | 'instagram' | 'tiktok' | 'email' | 'link';

export interface ShareOption {
  icon: LucideIcon;
  label: string;
  action: () => Promise<void>;
}

export interface ShareMetrics {
  analysis_id: string;
  share_type: string;
}