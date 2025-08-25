import { useSession } from '@supabase/auth-helpers-react';
import { useLocation } from 'react-router-dom';
import { useSubscriptionStatus } from '@/hooks/use-subscription-status';
import { useQAOverrides } from '@/hooks/use-qa-overrides';
import { isIOSPreview, isDevelopment } from '@/utils/flags';

export const QABottomBanner = () => {
  const session = useSession();
  const location = useLocation();
  const { hasCompletedQuiz, hasAccess, isLoading } = useSubscriptionStatus();
  const { isQAMode, qaAuth, qaAccess, qaQuiz } = useQAOverrides();
  
  // Check if QA banner should be shown
  const isDev = isDevelopment();
  const hasQAParam = isQAMode;
  const shouldShow = isDev || hasQAParam;
  
  // Hide by default in production previews
  if (!shouldShow) {
    return null;
  }
  
  // Read the same runtime flags as the guard
  const requireQuizAndSubscription = import.meta.env.VITE_REQUIRE_QUIZ_AND_SUBSCRIPTION === 'true';
  const bypass = isIOSPreview || !requireQuizAndSubscription;
  
  // Apply QA auth override for display
  const effectiveAuth = isQAMode && qaAuth !== null ? qaAuth === 'on' : !!session;
  
  const states = {
    quiz: hasCompletedQuiz,
    auth: effectiveAuth,
    access: hasAccess,
    bypass: bypass,
    loading: isLoading
  };
  
  // Add QA indicators if in QA mode
  const qaIndicators = isQAMode ? ` QA[${[
    qaAuth ? `auth=${qaAuth}` : '',
    qaAccess ? `access=${qaAccess}` : '',
    qaQuiz ? `quiz=${qaQuiz}` : ''
  ].filter(Boolean).join(',')}]` : '';
  
  const stateString = Object.entries(states)
    .map(([key, value]) => `${key}=${value}`)
    .join(' ') + qaIndicators;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-yellow-400 text-black text-xs px-2 py-1 font-mono">
      {stateString}
    </div>
  );
};