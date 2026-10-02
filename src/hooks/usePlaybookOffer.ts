import { useEffect, useState } from 'react';
import { playbookOffer } from '@/data/playbook';
export function usePlaybookOffer() {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return playbookOffer(now);
}
