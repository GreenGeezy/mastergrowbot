import { useMemo } from 'react';

interface QAOverrides {
  isQAMode: boolean;
  qaAuth: 'on' | 'off' | null;
  qaAccess: 'on' | 'off' | null;
  qaQuiz: 'done' | 'new' | null;
}

export const useQAOverrides = (): QAOverrides => {
  return useMemo(() => {
    const searchParams = new URLSearchParams(window.location.search);
    
    const isQAMode = searchParams.get('qa') === '1';
    
    if (!isQAMode) {
      return {
        isQAMode: false,
        qaAuth: null,
        qaAccess: null,
        qaQuiz: null
      };
    }
    
    const qaAuth = searchParams.get('qaAuth') as 'on' | 'off' | null;
    const qaAccess = searchParams.get('qaAccess') as 'on' | 'off' | null;
    const qaQuiz = searchParams.get('qaQuiz') as 'done' | 'new' | null;
    
    return {
      isQAMode,
      qaAuth: ['on', 'off'].includes(qaAuth as string) ? qaAuth : null,
      qaAccess: ['on', 'off'].includes(qaAccess as string) ? qaAccess : null,
      qaQuiz: ['done', 'new'].includes(qaQuiz as string) ? qaQuiz : null
    };
  }, [window.location.search]);
};