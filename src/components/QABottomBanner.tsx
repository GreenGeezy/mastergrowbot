import { useSession } from '@supabase/auth-helpers-react';
import { useSubscriptionStatus } from '@/hooks/use-subscription-status';
import { useQAOverrides } from '@/hooks/use-qa-overrides';
import { isIOSPreview, isDevelopment } from '@/utils/flags';

export const QABottomBanner = () => {
  const session = useSession();
  const { hasCompletedQuiz, hasAccess, isLoading } = useSubscriptionStatus();
  const { isQAMode, qaAuth, qaAccess, qaQuiz } = useQAOverrides();
  
  // Check if QA banner should be shown - same logic as before
  const isDev = isDevelopment();
  const shouldShow = isDev || isQAMode;
  
  // Hide by default in production previews
  if (!shouldShow) {
    return null;
  }
  
  // Read the exact same runtime flags as the guard
  const requireQuizAndSubscription = import.meta.env.VITE_REQUIRE_QUIZ_AND_SUBSCRIPTION === 'true';
  const disableAuthGate = import.meta.env.VITE_DISABLE_AUTH_GATE === 'true';
  const disableQuizGate = import.meta.env.VITE_DISABLE_QUIZ_GATE === 'true';
  const disableAccessGate = import.meta.env.VITE_DISABLE_ACCESS_GATE === 'true';
  const disableAllGates = import.meta.env.VITE_DISABLE_ALL_GATES === 'true';
  
  // Calculate bypass exactly like the guard does
  const bypass = isIOSPreview || !requireQuizAndSubscription || disableAllGates || disableAuthGate || disableQuizGate || disableAccessGate;
  
  // Apply QA auth override for display exactly like the guard
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
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-yellow-400 text-black text-xs px-2 py-1 font-mono">
      {stateString}
    </div>
  );
};