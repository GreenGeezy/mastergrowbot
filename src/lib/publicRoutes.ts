import type { ComponentType } from 'react';

export const publicPageLoaders = {
  Index: () => import('@/pages/Index'),
  GrowGuidesHub: () => import('@/pages/GrowGuidesHub'),
  GrowGuideArticle: () => import('@/pages/GrowGuideArticle'),
  GrowTech: () => import('@/pages/GrowTech'),
  LensKit: () => import('@/pages/LensKit'),
  VPDCalculator: () => import('@/pages/VPDCalculator'),
  About: () => import('@/pages/About'),
  Playbook: () => import('@/pages/Playbook'),
};
export type PublicPageKey = keyof typeof publicPageLoaders;
export type InitialPage = { key: PublicPageKey; component: ComponentType };
export const staticPublicRoutes: Record<string, PublicPageKey> = {
    '/': 'Index', '/grow-guides': 'GrowGuidesHub', '/grow-tech': 'GrowTech',
    '/grow-tech/apexel-macro-lens-kit': 'LensKit', '/vpd-calculator': 'VPDCalculator',
    '/about': 'About', '/playbooks': 'Playbook',
};
export function publicPageKey(path: string): PublicPageKey | undefined {
  return staticPublicRoutes[path] ?? (/^\/grow-guides\/[a-z0-9-]+$/.test(path) ? 'GrowGuideArticle' : undefined);
}
