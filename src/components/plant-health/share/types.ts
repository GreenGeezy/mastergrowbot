import { LucideIcon } from 'lucide-react';

export interface ShareOption {
  icon: LucideIcon;
  label: string;
  action: () => Promise<void | string>;
}