import React from 'react';
import { useWalkthrough } from '@/contexts/WalkthroughContext';
import {
  BottomNavWalkthrough,
  ChatInputWalkthrough,
  PlantHealthUploadWalkthrough,
  GuideSearchWalkthrough,
  SettingsSubscriptionWalkthrough,
  HomeQuickActionsWalkthrough
} from './WalkthroughSteps';

export function WalkthroughManager() {
  const { isWalkthroughActive } = useWalkthrough();

  if (!isWalkthroughActive) return null;

  return (
    <>
      <BottomNavWalkthrough />
      <ChatInputWalkthrough />
      <PlantHealthUploadWalkthrough />
      <GuideSearchWalkthrough />
      <SettingsSubscriptionWalkthrough />
      <HomeQuickActionsWalkthrough />
    </>
  );
}