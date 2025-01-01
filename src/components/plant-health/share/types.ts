import { LucideIcon } from 'lucide-react';

export interface ShareOption {
  icon: LucideIcon;
  label: string;
  action: () => Promise<void>;
}

export interface ShareMetrics {
  analysis_id: string;
  share_type: string;
}