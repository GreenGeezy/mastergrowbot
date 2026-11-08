import { useEffect, useState } from 'react';

export default function PremiumMotion({ name, label, poster }: { name: string; label: string; poster: string }) {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return <figure className="release-motion">
    {reduced ? <img src={poster} alt={label} width={1280} height={720} loading="lazy"/> : <video controls playsInline preload="none" poster={poster} aria-label={label}>
      <source src={`/videos/premium-2026/${name}.webm`} type="video/webm"/>
      <source src={`/videos/premium-2026/${name}.mp4`} type="video/mp4"/>
    </video>}
    <figcaption>{label}.</figcaption>
  </figure>;
}
