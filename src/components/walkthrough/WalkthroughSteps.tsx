import React, { useRef, useEffect } from 'react';
import { useWalkthrough } from '@/contexts/WalkthroughContext';
import { WalkthroughTooltip } from './WalkthroughTooltip';

// Bottom Navigation Walkthrough
export function BottomNavWalkthrough() {
  const { currentStep } = useWalkthrough();
  const targetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Find bottom navigation element
    const bottomNav = document.querySelector('nav[class*="bottom"]') || 
                     document.querySelector('.bottom-navigation') ||
                     document.querySelector('[data-testid="bottom-navigation"]') ||
                     document.querySelector('nav:last-of-type');
    
    if (bottomNav) {
      targetRef.current = bottomNav as HTMLElement;
    }
  }, [currentStep]);

  if (currentStep !== 'bottomNav' || !targetRef.current) return null;

  return (
    <WalkthroughTooltip
      targetRef={targetRef}
      title="Navigate with Bottom Tabs"
      description="Tap AI Chat to get personalized growing advice from our AI expert. Use these tabs to quickly switch between different features."
      step={1}
      totalSteps={6}
    />
  );
}

// AI Chat Input Walkthrough
export function ChatInputWalkthrough() {
  const { currentStep } = useWalkthrough();
  const targetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Find chat input element
    const chatInput = document.querySelector('textarea[placeholder*="Ask"]') ||
                     document.querySelector('input[placeholder*="Ask"]') ||
                     document.querySelector('.chat-input') ||
                     document.querySelector('[data-testid="chat-input"]');
    
    if (chatInput) {
      targetRef.current = chatInput as HTMLElement;
    }
  }, [currentStep]);

  if (currentStep !== 'aiChatInput' || !targetRef.current) return null;

  return (
    <WalkthroughTooltip
      targetRef={targetRef}
      title="Ask Your Growing Questions"
      description='Ask about your grow goal - type questions like "How do I increase yield?" or "What nutrients should I use?" You can also use the voice chat button for hands-free interaction.'
      step={2}
      totalSteps={6}
    />
  );
}

// Plant Health Upload Walkthrough
export function PlantHealthUploadWalkthrough() {
  const { currentStep } = useWalkthrough();
  const targetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Find upload/camera element
    const uploadArea = document.querySelector('.dropzone') ||
                      document.querySelector('[data-testid="image-dropzone"]') ||
                      document.querySelector('button[class*="camera"]') ||
                      document.querySelector('input[type="file"]')?.parentElement;
    
    if (uploadArea) {
      targetRef.current = uploadArea as HTMLElement;
    }
  }, [currentStep]);

  if (currentStep !== 'plantHealthUpload' || !targetRef.current) return null;

  return (
    <WalkthroughTooltip
      targetRef={targetRef}
      title="Scan Your Plant"
      description="Take a photo or upload images to get AI-powered health analysis. Our AI can identify issues, diseases, and provide treatment recommendations."
      step={3}
      totalSteps={6}
    />
  );
}

// Growing Guide Search Walkthrough
export function GuideSearchWalkthrough() {
  const { currentStep } = useWalkthrough();
  const targetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Find search input element
    const searchInput = document.querySelector('input[placeholder*="search"]') ||
                       document.querySelector('input[placeholder*="Search"]') ||
                       document.querySelector('.search-input') ||
                       document.querySelector('[data-testid="search-input"]');
    
    if (searchInput) {
      targetRef.current = searchInput as HTMLElement;
    }
  }, [currentStep]);

  if (currentStep !== 'guideSearch' || !targetRef.current) return null;

  return (
    <WalkthroughTooltip
      targetRef={targetRef}
      title="Search Growing Tips"
      description='Find tips on pests, nutrients, and growing techniques. Search our comprehensive guide for instant answers to common growing questions.'
      step={4}
      totalSteps={6}
    />
  );
}

// Settings Subscription Walkthrough
export function SettingsSubscriptionWalkthrough() {
  const { currentStep } = useWalkthrough();
  const targetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Find subscription section element
    const subscriptionSection = document.querySelector('[class*="subscription"]') ||
                               document.querySelector('.subscription-card') ||
                               document.querySelector('[data-testid="subscription-section"]') ||
                               document.querySelector('h2, h3, h4')?.closest('div');
    
    if (subscriptionSection) {
      targetRef.current = subscriptionSection as HTMLElement;
    }
  }, [currentStep]);

  if (currentStep !== 'settingsSub' || !targetRef.current) return null;

  return (
    <WalkthroughTooltip
      targetRef={targetRef}
      title="Manage Your Subscription"
      description="Manage your subscription, update preferences, and access support options. Here you can also customize your AI assistant settings."
      step={5}
      totalSteps={6}
    />
  );
}

// Home Dashboard Quick Actions Walkthrough
export function HomeQuickActionsWalkthrough() {
  const { currentStep } = useWalkthrough();
  const targetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Find quick actions or feature cards
    const quickActions = document.querySelector('.feature-cards') ||
                        document.querySelector('[class*="action-card"]') ||
                        document.querySelector('.quick-actions') ||
                        document.querySelector('[data-testid="feature-cards"]');
    
    if (quickActions) {
      targetRef.current = quickActions as HTMLElement;
    }
  }, [currentStep]);

  if (currentStep !== 'homeQuickActions' || !targetRef.current) return null;

  return (
    <WalkthroughTooltip
      targetRef={targetRef}
      title="Quick AI Action Cards"
      description="Access quick AI action cards from your dashboard for instant grow insights. These cards provide personalized recommendations based on your quiz results."
      step={6}
      totalSteps={6}
    />
  );
}