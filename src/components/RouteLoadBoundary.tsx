import { Component, type ReactNode } from 'react';
import { PLAYBOOK_CHECKOUT_URL } from '@/data/playbook';

type Props = { children: ReactNode; pathname: string };
type State = { failed: boolean };

// A failed route import must not erase the entire purchase path.
export default class RouteLoadBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    const isPlaybookCheckout = /^\/playbooks?\/checkout\/?$/.test(this.props.pathname);
    return <main className="flex min-h-screen items-center justify-center bg-[#030906] px-5 py-12 text-white">
      <section className="w-full max-w-lg rounded-2xl border border-emerald-400/25 p-6" role="alert">
        <p className="text-sm font-semibold text-emerald-300">MasterGrowbot AI</p>
        <h1 className="mt-3 text-2xl font-bold">This page couldn’t load.</h1>
        <p className="mt-4 leading-7 text-white/80">Refresh this page to try again. You’ll stay at the same address.</p>
        <button type="button" className="mt-6 min-h-12 rounded-xl bg-emerald-300 px-5 py-3 font-bold text-black" onClick={() => window.location.reload()}>Refresh this page</button>
        {isPlaybookCheckout && <div className="mt-6">
          <a className="inline-flex min-h-12 items-center font-semibold text-emerald-300 underline" href={PLAYBOOK_CHECKOUT_URL}>Continue in secure Whop checkout</a>
          <p className="mt-3 text-sm leading-6 text-white/70">If you already submitted payment, check your Whop receipt before placing another order.</p>
        </div>}
        <p className="mt-6 text-sm leading-6 text-white/70">Need help? <a className="text-emerald-300 underline" href="mailto:support@mastergrowbot.com">Contact support</a>.</p>
        <a className="mt-4 inline-flex min-h-11 items-center text-sm text-emerald-300 underline" href="/">Return to MasterGrowbot</a>
      </section>
    </main>;
  }
}