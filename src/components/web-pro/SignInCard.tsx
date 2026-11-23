import { type FormEvent, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { appleAuthEnabled, signInWithEmail, signInWithProvider } from '@/lib/supabase';
import { SUPPORT_EMAIL } from '@/lib/webPro';
import { trackEvent } from '@/lib/analytics';

const buttonClass = 'flex h-12 w-full items-center justify-center gap-3 rounded-xl text-[15px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-landing-green';
const inputClass = 'h-12 w-full rounded-xl border border-white/15 bg-black/40 px-4 text-base text-white placeholder:text-white/40 outline-none transition focus:border-landing-green focus:ring-2 focus:ring-landing-green/30';

const AppleMark = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.05 12.54c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-2.06-.92-3.39-.89-1.74.03-3.35 1.01-4.25 2.57-1.81 3.14-.46 7.8 1.3 10.35.86 1.25 1.89 2.65 3.24 2.6 1.3-.05 1.79-.84 3.36-.84s2.01.84 3.39.81c1.4-.02 2.28-1.27 3.14-2.53.99-1.45 1.4-2.85 1.42-2.92-.03-.01-2.72-1.04-2.74-4.14ZM14.47 4.91c.72-.87 1.2-2.08 1.07-3.28-1.03.04-2.28.69-3.02 1.55-.66.77-1.24 2-1.08 3.17 1.15.09 2.32-.58 3.03-1.44Z" />
  </svg>
);
const GoogleMark = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

export default function SignInCard() {
  const [create, setCreate] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState<'apple' | 'google' | 'email' | null>(null);
  const [error, setError] = useState('');

  const withProvider = async (provider: 'apple' | 'google') => {
    setError('');
    setBusy(provider);
    trackEvent('web_pro_sign_in_start', { method: provider });
    const result = await signInWithProvider(provider).catch(() => ({ ok: false as const, message: 'Sign in could not start. Please try again.' }));
    // On success the browser leaves this page, so the button stays busy on purpose.
    if (result.ok === false) { setError(result.message); setBusy(null); }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (create && password.length < 8) { setError('Choose a password with at least 8 characters.'); return; }
    setBusy('email');
    trackEvent('web_pro_sign_in_start', { method: create ? 'email_create' : 'email' });
    const result = await signInWithEmail(email, password, create).catch(() => ({ ok: false as const, message: 'The connection dropped. Check your internet and try again.' }));
    if (result.ok === false) setError(result.message);
    setBusy(null);
  };

  return (
    <div className="font-sans">
      <div className="space-y-3">
        {appleAuthEnabled && (
          <button type="button" disabled={busy !== null} onClick={() => withProvider('apple')} className={`${buttonClass} bg-white text-black hover:bg-white/90`}>
            {busy === 'apple' ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <AppleMark />} Continue with Apple
          </button>
        )}
        <button type="button" disabled={busy !== null} onClick={() => withProvider('google')} className={`${buttonClass} bg-white text-[#1f1f1f] hover:bg-white/90`}>
          {busy === 'google' ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <GoogleMark />} Continue with Google
        </button>
      </div>

      <div className="my-5 flex items-center gap-3 text-xs text-white/55">
        <span className="h-px flex-1 bg-white/15" aria-hidden="true" /> or use email <span className="h-px flex-1 bg-white/15" aria-hidden="true" />
      </div>

      <form onSubmit={submit} className="space-y-3">
        <label className="block">
          <span className="sr-only">Email address</span>
          <input type="email" name="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className={inputClass} />
        </label>
        <label className="block">
          <span className="sr-only">Password</span>
          <input type="password" name="password" autoComplete={create ? 'new-password' : 'current-password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder={create ? 'Create a password (8 or more characters)' : 'Password'} className={inputClass} />
        </label>
        <p role="alert" aria-live="polite" className={error ? 'rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm leading-relaxed text-red-200' : 'sr-only'}>{error}</p>
        <button type="submit" disabled={busy !== null} className={`${buttonClass} bg-landing-green font-bold text-black hover:bg-landing-green/90`}>
          {busy === 'email' && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}{create ? 'Create account and continue' : 'Sign in'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-white/65">
        {create ? 'Already have a Web Pro account?' : 'New to Web Pro?'}{' '}
        <button type="button" onClick={() => { setCreate(!create); setError(''); }} className="font-semibold text-landing-green underline-offset-4 hover:underline">
          {create ? 'Sign in' : 'Create an account'}
        </button>
      </p>
      <p className="mt-4 text-center text-xs leading-relaxed text-white/55">
        Always sign in with the same method you used when subscribing ({appleAuthEnabled ? 'Apple, Google, or Email' : 'Google or Email'}).
        {!create && <> Forgot your password? Email <a className="underline hover:text-white" href={`mailto:${SUPPORT_EMAIL}?subject=Web%20Pro%20password%20help`}>{SUPPORT_EMAIL}</a>.</>}
      </p>
    </div>
  );
}
