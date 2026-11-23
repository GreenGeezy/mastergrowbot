import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { CheckCircle2, ExternalLink, Loader2, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WhopElementsCheckout } from '@/components/checkout/WhopElementsCheckout';
import { trackCheckoutSuccess, trackEvent } from '@/lib/analytics';
import { deleteAccount, ensureWebProfile, isPrivateRelay, signOut, supabase } from '@/lib/supabase';
import { claimPayment, getAccess, restoreAccess, WebProError, type Access } from '@/lib/webProApi';
import { availablePlans, PLANS, recallPlan, rememberPlan, SUPPORT_EMAIL, webProLive, WHOP_ORDERS_URL, type PlanKey } from '@/lib/webPro';
import DiagnosisTool from './DiagnosisTool';
import EliteWaitlist from './EliteWaitlist';
import { prettyDate } from './ReportCard';
import { ChecklistTab, Notice, NumbersTab, ReportsTab } from './SavedTools';
import SignInCard from './SignInCard';

type Status = 'loading' | 'signed-out' | 'checking' | 'ready' | 'error';
type Props = { plan: PlanKey; onPlan: (plan: PlanKey) => void; onActive: (active: boolean) => void };

const planItem = (plan: PlanKey) => ({ item_id: `web-pro-${plan}`, item_name: `MasterGrowbot Web Pro ${PLANS[plan].label}`, item_category: 'Web Pro', price: PLANS[plan].price, quantity: 1 });
const planPayload = (plan: PlanKey) => ({ currency: 'USD', value: PLANS[plan].price, checkout_source_page: '/pro', plan_id: PLANS[plan].id, items: [planItem(plan)] });

/** Reads the payment Whop adds to the return address, then tidies the address bar. */
function takeReturnedPayment(): { paymentId: string | null; failed: boolean } {
  const url = new URL(window.location.href);
  const paymentId = url.searchParams.get('payment');
  const status = url.searchParams.get('status');
  if (!paymentId && !status) return { paymentId: null, failed: false };
  url.searchParams.delete('payment');
  url.searchParams.delete('status');
  window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
  const failed = status === 'failed' || status === 'canceled';
  return { paymentId: !failed && paymentId && /^pay_\w+$/.test(paymentId) ? paymentId : null, failed };
}

export default function WebProAccount({ plan, onPlan, onActive }: Props) {
  const [status, setStatus] = useState<Status>('loading');
  const [user, setUser] = useState<User | null>(null);
  const [access, setAccess] = useState<Access | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [unlocking, setUnlocking] = useState(false);
  const [pendingPayment, setPendingPayment] = useState<string | null>(null);
  const returned = useRef<{ paymentId: string | null; failed: boolean } | null>(null);
  const checkedUser = useRef<string | null>(null);
  const currentUser = useRef<string | null>(null);

  const unlock = useCallback(async (paymentId: string) => {
    setUnlocking(true);
    setError('');
    setPendingPayment(paymentId);
    try {
      setAccess(await claimPayment(paymentId));
      setStatus('ready');
      setPendingPayment(null);
      setNotice('');
      trackEvent('web_pro_unlocked');
    } catch (e) {
      setError(e instanceof WebProError ? e.message : 'We could not finish unlocking yet.');
      setStatus('ready');
      if (e instanceof WebProError && ['payment_not_paid', 'payment_mismatch', 'membership_ended'].includes(e.code)) setPendingPayment(null);
    }
    setUnlocking(false);
  }, []);

  const check = useCallback(async (account: User) => {
    setStatus('checking');
    setError('');
    try {
      await ensureWebProfile(account);
      const next = await getAccess();
      if (currentUser.current !== account.id) return;
      setAccess(next);
      setStatus('ready');
      const payment = returned.current?.paymentId;
      if (returned.current) returned.current = { paymentId: null, failed: false };
      if (payment && !next.active) await unlock(payment);
    } catch (e) {
      if (currentUser.current !== account.id) return;
      setError(e instanceof WebProError ? e.message : 'Your account could not be loaded. Please try again.');
      setStatus('error');
    }
  }, [unlock]);

  useEffect(() => {
    returned.current ??= takeReturnedPayment();
    if (returned.current.failed) setNotice('That payment was not completed, and nothing was unlocked. You can try again below.');

    const apply = (account: User | null) => {
      const member = account && !account.is_anonymous ? account : null;
      currentUser.current = member?.id ?? null;
      setUser(member);
      if (!member) { checkedUser.current = null; setAccess(null); setPendingPayment(null); setStatus('signed-out'); return; }
      if (checkedUser.current === member.id) return; // token refreshes keep the open checkout in place
      checkedUser.current = member.id;
      void check(member);
    };
    supabase.auth.getSession().then(({ data }) => apply(data.session?.user ?? null)).catch(() => apply(null));
    // Supabase asks callers not to await its own methods inside this callback.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== 'INITIAL_SESSION') setTimeout(() => apply(session?.user ?? null), 0);
    });
    return () => subscription.unsubscribe();
  }, [check]);

  useEffect(() => { const remembered = recallPlan(); if (remembered && PLANS[remembered].id) onPlan(remembered); }, [onPlan]);
  useEffect(() => { onActive(Boolean(access?.active)); }, [access?.active, onActive]);

  if (status === 'loading' || status === 'checking' || unlocking) {
    return (
      <Shell>
        <div role="status" className="flex flex-col items-center py-12 text-center">
          <Loader2 className="h-9 w-9 animate-spin text-landing-green" aria-hidden="true" />
          <p className="mt-4 font-semibold text-white">{unlocking ? 'Payment received. Unlocking Web Pro' : 'Loading your account'}</p>
          {unlocking && <p className="mt-1.5 text-sm text-white/65">This can take a few seconds. Please keep this page open.</p>}
        </div>
      </Shell>
    );
  }

  if (status === 'signed-out' || !user) {
    return (
      <Shell>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-landing-green">{webProLive ? 'Step 1 of 2' : 'Account'}</p>
        <h2 className="mb-5 mt-2 font-sans text-2xl font-bold text-white">{webProLive ? 'Create your account' : 'Sign in'}</h2>
        {notice && <p className="mb-4 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm text-white/80">{notice}</p>}
        <SignInCard />
      </Shell>
    );
  }

  if (status === 'error') {
    return (
      <Shell>
        <h2 className="mb-4 font-sans text-xl font-bold text-white">Your account could not be checked</h2>
        <Notice onRetry={() => check(user)}>{error}</Notice>
        <p className="mt-4 text-sm text-white/65">Checkout stays closed until this works, so you are never charged for something we cannot unlock.</p>
        <button type="button" onClick={() => signOut()} className="mt-4 min-h-11 text-sm font-semibold text-white/75 underline">Sign out</button>
      </Shell>
    );
  }

  if (access?.active) return <Workspace user={user} access={access} setAccess={setAccess} />;

  return (
    <Shell>
      <Checkout
        user={user} plan={plan} onPlan={onPlan} error={error} notice={notice} pendingPayment={pendingPayment}
        onPaid={unlock}
        onRestore={async () => {
          const next = await restoreAccess();
          setAccess(next);
          return next.active;
        }}
      />
    </Shell>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-lg rounded-3xl border border-white/15 bg-[#070b08] p-5 font-sans shadow-[0_30px_90px_-30px_rgba(29,185,84,0.35)] sm:p-8">{children}</div>;
}

type CheckoutProps = {
  user: User; plan: PlanKey; onPlan: (plan: PlanKey) => void; error: string; notice: string; pendingPayment: string | null;
  onPaid: (paymentId: string) => Promise<void>; onRestore: () => Promise<boolean>;
};

function Checkout({ user, plan, onPlan, error, notice, pendingPayment, onPaid, onRestore }: CheckoutProps) {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [restoring, setRestoring] = useState(false);
  const [restoreNote, setRestoreNote] = useState('');
  const completed = useRef(false);
  const selected = PLANS[plan].id ? plan : availablePlans[0];
  const planId = selected ? PLANS[selected].id : null;
  const metadata = useMemo(() => ({ supabase_user_id: user.id, source: 'web-pro' }), [user.id]);
  const email = isPrivateRelay(user.email) ? undefined : user.email ?? undefined;

  useEffect(() => { if (planId && !pendingPayment) trackEvent('begin_checkout', planPayload(selected)); }, [planId, pendingPayment, selected]);
  useEffect(() => { setState('loading'); }, [planId]);

  const restore = async () => {
    setRestoring(true);
    setRestoreNote('');
    try {
      const found = await onRestore();
      if (!found) setRestoreNote('No active Web Pro subscription was found for this sign-in. Check that you used the same sign-in method as when you subscribed.');
    } catch (e) { setRestoreNote(e instanceof Error ? e.message : 'That did not work. Please try again.'); }
    setRestoring(false);
  };

  const account = (
    <>
    <p className="mt-5 text-center text-xs leading-relaxed text-white/60">
      Signed in as {user.email ?? 'your account'}. <button type="button" onClick={() => signOut()} className="underline hover:text-white">Sign out</button>
      {' '}or <button type="button" onClick={restore} disabled={restoring} className="underline hover:text-white disabled:opacity-60">{restoring ? 'checking' : 'restore a purchase'}</button>.
      {restoreNote && <span role="status" className="mt-2 block text-white/75">{restoreNote}</span>}
    </p>
    {!pendingPayment && <details className="mt-3 text-center text-xs text-white/55"><summary className="cursor-pointer py-2 hover:text-white">Delete this account</summary><div className="text-left"><DeleteAccount /></div></details>}
    </>
  );

  // Never show a second payment form while a payment is waiting to be confirmed.
  if (pendingPayment) {
    return (
      <>
        <h2 className="font-sans text-xl font-bold text-white">Your payment is being confirmed</h2>
        <p className="mt-3 text-sm leading-relaxed text-white/75">{error || 'This is taking longer than usual.'} You do not need to pay again.</p>
        <button type="button" onClick={() => onPaid(pendingPayment)} className="mt-5 h-12 w-full rounded-full bg-landing-green font-bold text-black hover:bg-landing-green/90">Check again</button>
        <p className="mt-4 text-sm text-white/65">Still waiting after 10 minutes? Email <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`Web Pro payment ${pendingPayment}`)}`} className="text-landing-green underline">{SUPPORT_EMAIL}</a> with this reference: <span className="break-all text-white">{pendingPayment}</span></p>
        {account}
      </>
    );
  }

  if (!planId) {
    return (
      <>
        <h2 className="font-sans text-xl font-bold text-white">Web Pro is not open yet</h2>
        <p className="mt-3 text-sm leading-relaxed text-white/75">You are signed in and nothing has been charged. The MasterGrowbot AI app is available today on iPhone and Android.</p>
        {account}
      </>
    );
  }

  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-landing-green">Step 2 of 2</p>
      <h2 className="mt-2 font-sans text-2xl font-bold text-white">Start Web Pro</h2>
      {availablePlans.length > 1 && (
        <div className="mt-4 grid grid-cols-2 gap-2" role="group" aria-label="Choose a plan">
          {availablePlans.map((key) => (
            <button key={key} type="button" aria-pressed={key === selected} onClick={() => { rememberPlan(key); onPlan(key); }} className={`min-h-12 rounded-xl border px-3 py-2 text-sm font-semibold transition ${key === selected ? 'border-landing-green bg-landing-green/10 text-white' : 'border-white/15 text-white/70 hover:border-white/35'}`}>
              {PLANS[key].label}, {PLANS[key].display}
            </button>
          ))}
        </div>
      )}
      <p className="mt-4 text-sm leading-relaxed text-white/75">{PLANS[selected].terms} Cancel anytime and keep access until the paid period ends.</p>
      {(error || notice) && <p role="alert" className="mt-4 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm text-white/80">{error || notice}</p>}
      {isPrivateRelay(user.email) && <p className="mt-4 text-sm text-white/70">Use an email you can open at checkout, so your receipt and billing link reach you.</p>}

      <div className="mt-5 overflow-hidden rounded-2xl bg-white text-black" style={{ minHeight: 420 }}>
        <WhopElementsCheckout
          key={planId}
          planId={planId}
          theme="light"
          metadata={metadata}
          buyerEmail={email}
          returnUrl={`${window.location.origin}/pro`}
          onStateChange={setState}
          fallback={<p role="status" className="p-8 text-center text-sm text-black/60">Loading secure checkout</p>}
          onComplete={(_plan, paymentId) => {
            if (completed.current) return;
            completed.current = true;
            trackCheckoutSuccess(planPayload(selected), paymentId);
            void onPaid(paymentId);
          }}
        />
      </div>
      {state === 'error' && <p role="alert" className="mt-4 text-sm leading-relaxed text-white/80">The payment form did not load. Turn off any ad blocker for this page and <button type="button" onClick={() => window.location.reload()} className="text-landing-green underline">reload</button>. Nothing has been charged.</p>}
      <p className="mt-4 flex items-center justify-center gap-2 text-xs text-white/60"><Lock className="h-3.5 w-3.5" aria-hidden="true" /> Payments processed securely by Whop</p>
      <p className="mt-2 text-center text-xs leading-relaxed text-white/60">Our Whop store is named Smart Ag AI. Outside the US, Whop may charge in your local currency, and the total in the form is the final price.</p>
      <p className="mt-2 text-center text-xs leading-relaxed text-white/60">By subscribing you agree to the <Link to="/terms-of-service" className="underline hover:text-white">Terms</Link> and <Link to="/privacy-policy" className="underline hover:text-white">Privacy Policy</Link>.</p>
      {account}
    </>
  );
}

const TABS = [['report', 'Plant report'], ['reports', 'My reports'], ['numbers', 'Grow numbers'], ['checklist', 'Checklists'], ['account', 'Account']] as const;
type Tab = (typeof TABS)[number][0];

function Workspace({ user, access, setAccess }: { user: User; access: Access; setAccess: (access: Access) => void }) {
  const [tab, setTab] = useState<Tab>('report');
  const [refresh, setRefresh] = useState(0);
  return (
    <div className="font-sans">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-sans text-2xl font-bold text-white sm:text-3xl">Your Web Pro workspace</h2>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-landing-green/35 bg-landing-green/10 px-3 py-1 text-xs font-semibold text-landing-green"><CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Active</span>
      </div>
      <div className="-mx-4 mt-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="flex min-w-max gap-2" role="group" aria-label="Web Pro tools">
          {TABS.map(([key, label]) => (
            <button key={key} type="button" aria-pressed={tab === key} onClick={() => setTab(key)} className={`min-h-11 rounded-full px-5 text-sm font-semibold transition ${tab === key ? 'bg-landing-green text-black' : 'bg-white/[0.06] text-white/75 hover:bg-white/[0.12] hover:text-white'}`}>{label}</button>
          ))}
        </div>
      </div>
      <div className="mt-6">
        {/* Kept mounted so switching tabs never interrupts a report that is being created. */}
        <div hidden={tab !== 'report'}><DiagnosisTool usage={access.usage} onUsage={(usage) => setAccess({ ...access, usage })} onSaved={() => setRefresh((n) => n + 1)} /></div>
        {tab === 'reports' && <ReportsTab userId={user.id} refresh={refresh} />}
        {tab === 'numbers' && <NumbersTab userId={user.id} />}
        {tab === 'checklist' && <ChecklistTab userId={user.id} />}
        {tab === 'account' && <AccountTab user={user} access={access} />}
      </div>
    </div>
  );
}

function AccountTab({ user, access }: { user: User; access: Access }) {
  const plan = (Object.keys(PLANS) as PlanKey[]).find((key) => PLANS[key].id === access.planId);
  const renewing = !access.cancelAtPeriodEnd;

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h3 className="font-sans text-lg font-bold text-white">Subscription</h3>
        <dl className="mt-4 space-y-2 text-sm">
          {[
            ['Plan', plan ? `Web Pro ${PLANS[plan].label}` : 'Web Pro'],
            ['Status', access.status === 'past_due' ? 'Payment needs attention' : renewing ? 'Active' : 'Cancelled, access until the date below'],
            [renewing ? 'Next renewal' : 'Access ends', access.renewsAt ? prettyDate(access.renewsAt) : 'See your Whop billing page'],
            ['Signed in as', user.email ?? 'Your account'],
          ].map(([label, value]) => <div key={label} className="flex justify-between gap-4"><dt className="text-white/60">{label}</dt><dd className="text-right font-semibold text-white">{value}</dd></div>)}
        </dl>
        <a href={access.manageUrl ?? WHOP_ORDERS_URL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-landing-green px-6 text-sm font-bold text-black hover:bg-landing-green/90">
          Manage or cancel subscription <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
        <p className="mt-3 text-xs leading-relaxed text-white/60">Opens Whop, where you can change your card, see receipts or cancel. Sign in there with the email you used at checkout.</p>
        <button type="button" onClick={() => signOut()} className="mt-4 min-h-11 text-sm font-semibold text-white/80 underline">Sign out</button>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h3 className="font-sans text-lg font-bold text-white">Delete account</h3>
        {renewing ? (
          <p className="mt-3 text-sm leading-relaxed text-white/70">Cancel your subscription first, using the button on this page, so you are not billed again. Then come back here and reload to delete your account and saved data.</p>
        ) : (
          <DeleteAccount />
        )}
      </section>

      <div className="lg:col-span-2"><EliteWaitlist /></div>
      <p className="text-sm text-white/65 lg:col-span-2">
        Need help? Email <a href={`mailto:${SUPPORT_EMAIL}`} className="text-landing-green underline">{SUPPORT_EMAIL}</a>.
      </p>
    </div>
  );
}

/** Offered only when no subscription would keep billing after the account is gone. */
function DeleteAccount() {
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const remove = async () => {
    setBusy(true);
    setError('');
    const result = await deleteAccount().catch(() => ({ ok: false as const, message: 'The connection dropped. Please try again.' }));
    if (result.ok === false) { setError(result.message); setBusy(false); }
  };

  return (
    <>
      <p className="mt-3 text-sm leading-relaxed text-white/70">This permanently removes your sign-in, reports, numbers and checklists, and ends any remaining Web Pro access. It cannot be undone. Type DELETE to confirm.</p>
      <label className="mt-4 block"><span className="sr-only">Type DELETE to confirm</span>
        <input value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="off" placeholder="DELETE" className="h-12 w-full rounded-xl border border-white/15 bg-black/40 px-4 text-base text-white placeholder:text-white/40" />
      </label>
      <button type="button" disabled={confirm !== 'DELETE' || busy} onClick={remove} className="mt-3 h-12 rounded-full border border-red-400/50 px-6 text-sm font-bold text-red-200 disabled:opacity-40">{busy ? 'Deleting' : 'Delete my account'}</button>
      {error && <div className="mt-4"><Notice>{error}</Notice></div>}
    </>
  );
}
