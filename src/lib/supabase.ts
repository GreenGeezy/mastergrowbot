import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';

// Web-only client for /pro. The mobile apps have their own client and are not affected by this file.
// Import this module only from code that is loaded on /pro or /auth/callback, so other pages stay light.

const PROJECT_URL = 'https://vofwdhlwsahwxecewyek.supabase.co';
// Publishable key: safe in the browser by design. Row rules protect the data.
const PUBLISHABLE_KEY = 'sb_publishable_nVYJrVpgVGW5mSuafXfMRg_Nr_3BKxm';

const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
// The committed .env still names a retired project. Only accept settings for the live one, so a
// missing Vercel variable can never send a buyer's sign-in to the wrong database.
const envMatches = envUrl?.replace(/\/$/, '') === PROJECT_URL && Boolean(envKey);

export const supabase: SupabaseClient = createClient(
  PROJECT_URL,
  envMatches ? (envKey as string) : PUBLISHABLE_KEY,
  { auth: { flowType: 'pkce', persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } },
);

export const appleAuthEnabled = import.meta.env.VITE_ENABLE_APPLE_AUTH === 'true';

export type AuthResult = { ok: true } | { ok: false; message: string };

export async function signInWithProvider(provider: 'apple' | 'google'): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
  return error ? { ok: false, message: 'Sign in could not start. Please try again, or use email instead.' } : { ok: true };
}

function friendlyAuthError(code: string | undefined, message: string): string {
  if (code === 'invalid_credentials') return 'That email and password do not match. Check both, or use the sign-in method you chose before.';
  if (code === 'user_already_exists' || code === 'email_exists') return 'That email already has an account. Choose Sign in instead.';
  if (code === 'weak_password') return 'Choose a longer password, with at least 8 characters.';
  if (code === 'over_request_rate_limit') return 'Too many tries. Wait a minute and try again.';
  if (code === 'email_address_invalid' || code === 'validation_failed') return 'Enter a valid email address.';
  if (/fetch|network/i.test(message)) return 'The connection dropped. Check your internet and try again.';
  return 'Sign in did not work. Please try again.';
}

export async function signInWithEmail(email: string, password: string, create: boolean): Promise<AuthResult> {
  const credentials = { email: email.trim(), password };
  const { data, error } = create
    ? await supabase.auth.signUp(credentials)
    : await supabase.auth.signInWithPassword(credentials);
  if (error) return { ok: false, message: friendlyAuthError(error.code, error.message) };
  if (!data.session) return { ok: false, message: 'That email already has an account. Choose Sign in instead.' };
  return { ok: true };
}

/** Same safe pattern as the mobile app: insert if missing, then a lookup that never returns a 406. */
export async function ensureWebProfile(user: User): Promise<boolean> {
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, email: user.email ?? null }, { onConflict: 'id', ignoreDuplicates: true });
  if (error) return false;
  const { data, error: readError } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
  return !readError && Boolean(data);
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut({ scope: 'local' });
}

/** Uses the same deletion service as the app. The server only ever deletes the signed-in account. */
export async function deleteAccount(): Promise<AuthResult> {
  const { data, error } = await supabase.functions.invoke('delete-account', { body: { confirm: 'DELETE' } });
  if (error || !(data as { ok?: boolean } | null)?.ok) {
    return { ok: false, message: 'Your account could not be deleted right now. Please try again.' };
  }
  await signOut();
  return { ok: true };
}

/** Apple Hide My Email addresses work for sign-in but may not receive Whop receipts. */
export const isPrivateRelay = (email: string | undefined | null) =>
  Boolean(email?.toLowerCase().endsWith('@privaterelay.appleid.com'));
