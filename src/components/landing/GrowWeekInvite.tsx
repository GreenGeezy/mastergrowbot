import { ArrowRight } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

// Contextual invitation for Grow Guides and GrowTech editorial pages only.
// Place it after the reader has finished the content, never beside a purchase button.
type Props = { source: 'grow_guides' | 'growtech'; content: string; lead?: string; body?: string };

export default function GrowWeekInvite({ source, content, lead = 'Know what this week needs.', body = 'Grow Week turns your sprout and flip dates into a week-by-week plan: what’s normal now, what to check, calendar reminders and an AI check-in that knows your plant. Free, no account.' }: Props) {
  const href = `/cannabis-grow-calendar?utm_source=${source}&utm_medium=website&utm_campaign=grow_week&utm_content=${encodeURIComponent(content)}`;
  return (
    <aside aria-label="Free grow calendar" className="mx-auto my-10 max-w-3xl px-5">
      <a href={href} onClick={() => trackEvent('grow_week_entry_click', { placement: source, content })}
        className="group block rounded-2xl border border-[#e9d9a8]/25 bg-[#f4efe1]/[0.06] p-5 text-left transition hover:border-[#e9d9a8]/50 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e9d9a8]/80">Free tool · Grow Week</p>
        <p className="mt-2 font-serif text-2xl text-white">{lead}</p>
        <p className="mt-2 text-sm leading-relaxed text-white/65 sm:text-base">{body}</p>
        <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#e9d9a8]">Open the grow calendar <ArrowRight size={16} aria-hidden="true" className="transition group-hover:translate-x-0.5" /></span>
      </a>
    </aside>
  );
}
