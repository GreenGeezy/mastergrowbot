import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

/** Return point for Google and Apple sign-in. The client finishes the PKCE exchange as it starts up. */
export default function AuthCallback() {
  const navigate = useNavigate();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let stopped = false;
    const finish = () => { if (!stopped) { stopped = true; navigate('/pro#account', { replace: true }); } };

    const query = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.slice(1));
    if (query.get('error') || hash.get('error')) { setFailed(true); return; }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && !session.user.is_anonymous) finish();
    });
    // getSession waits for the code exchange, so no session here means the sign-in did not complete.
    supabase.auth.getSession()
      .then(({ data }) => { if (data.session) finish(); else if (!stopped) setFailed(true); })
      .catch(() => { if (!stopped) setFailed(true); });
    return () => { stopped = true; subscription.unsubscribe(); };
  }, [navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-center font-sans text-white">
      <Helmet><title>Signing in | MasterGrowbot AI</title><meta name="robots" content="noindex,nofollow" /></Helmet>
      {failed ? (
        <div className="max-w-md">
          <h1 className="text-2xl font-bold">Sign in was not completed</h1>
          <p className="mt-3 leading-relaxed text-white/70">Nothing was charged. Go back and try again, or choose a different sign-in method.</p>
          <Link to="/pro#account" className="mt-6 inline-flex h-12 items-center rounded-full bg-landing-green px-7 font-bold text-black hover:bg-landing-green/90">Back to Web Pro</Link>
        </div>
      ) : (
        <div role="status">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-landing-green" aria-hidden="true" />
          <h1 className="mt-5 text-lg font-semibold">Signing you in</h1>
        </div>
      )}
    </main>
  );
}
