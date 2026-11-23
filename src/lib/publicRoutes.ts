import type { ComponentType } from 'react';

export const publicPageLoaders = {
  GrowWeek: () => import('@/pages/GrowWeek'),
  Newsletter: () => import('@/pages/Newsletter'),
  Index: () => import('@/pages/Index'),
  GrowGuidesHub: () => import('@/pages/GrowGuidesHub'),
  GrowGuideArticle: () => import('@/pages/GrowGuideArticle'),
  GrowTech: () => import('@/pages/GrowTech'),
  LensKit: () => import('@/pages/LensKit'),
  VPDCalculator: () => import('@/pages/VPDCalculator'),
  GrowLightCalculator: () => import('@/pages/GrowLightCalculator'),
  SymptomChecker: () => import('@/pages/SymptomChecker'),
  About: () => import('@/pages/About'),
  Playbook: () => import('@/pages/Playbook'),
  WebPro: () => import('@/pages/WebPro'),
};
export type PublicPageKey = keyof typeof publicPageLoaders;
export type InitialPage = { key: PublicPageKey; component: ComponentType };
export const staticPublicRoutes: Record<string, PublicPageKey> = {
    '/cannabis-grow-calendar': 'GrowWeek',
    '/newsletter': 'Newsletter',
    '/': 'Index', '/grow-guides': 'GrowGuidesHub', '/grow-tech': 'GrowTech',
    '/grow-tech/apexel-macro-lens-kit': 'LensKit', '/vpd-calculator': 'VPDCalculator',
    '/grow-light-calculator': 'GrowLightCalculator',
    '/cannabis-symptom-checker': 'SymptomChecker',
    '/about': 'About', '/playbooks': 'Playbook', '/pro': 'WebPro',
};
export function publicPageKey(path: string): PublicPageKey | undefined {
  return staticPublicRoutes[path] ?? (/^\/grow-guides\/[a-z0-9-]+$/.test(path) ? 'GrowGuideArticle' : undefined);
}
