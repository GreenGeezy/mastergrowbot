import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowRight, CalendarDays, CheckCircle, Copy, Send, ShieldCheck } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingNav from "@/components/landing/LandingNav";
import SEOHead from "@/components/SEOHead";
import { trackEvent, trackPendingCheckoutSuccess } from "@/lib/analytics";

const intakePageUrl = "https://www.mastergrowbot.com/ai-strategy/intake";
const fallbackBookingUrl = "https://calendar.app.google/Ez6qmV9douCc4xhr6";
const existingFormspreeId = "mrerazdy";

type SubmitState = "idle" | "submitting" | "success" | "error";

function resolveFormEndpoint() {
  const configuredEndpoint = import.meta.env.NEXT_PUBLIC_AI_STRATEGY_INTAKE_FORM_ENDPOINT?.trim();

  if (!configuredEndpoint) {
    return `https://formspree.io/f/${existingFormspreeId}`;
  }

  if (configuredEndpoint.startsWith("https://")) {
    return configuredEndpoint;
  }

  return `https://formspree.io/f/${configuredEndpoint}`;
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-white/78">{label}</span>
      <input
        className="mt-2 w-full rounded-lg border border-white/10 bg-black/45 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-landing-green/70 focus:ring-2 focus:ring-landing-green/20"
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-white/78">{label}</span>
      <textarea
        className="mt-2 min-h-28 w-full rounded-lg border border-white/10 bg-black/45 px-4 py-3 text-sm leading-relaxed text-white outline-none transition placeholder:text-white/30 focus:border-landing-green/70 focus:ring-2 focus:ring-landing-green/20"
        name={name}
        required={required}
        placeholder={placeholder}
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
  required = false,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-white/78">{label}</span>
      <select
        className="mt-2 w-full rounded-lg border border-white/10 bg-black/45 px-4 py-3 text-sm text-white outline-none transition focus:border-landing-green/70 focus:ring-2 focus:ring-landing-green/20"
        name={name}
        required={required}
        defaultValue=""
      >
        <option value="" disabled>
          Select one
        </option>
        {options.map((option) => (
          <option key={option} className="bg-[#050806] text-white" value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function SectionCard({
  title,
  children,
  intro,
}: {
  title: string;
  children: React.ReactNode;
  intro?: string;
}) {
  return (
    <section className="rounded-xl border border-landing-green/18 bg-white/[0.035] p-5 shadow-xl shadow-black/20 sm:p-6">
      <h2 className="text-xl font-bold text-white sm:text-2xl">{title}</h2>
      {intro ? <p className="mt-3 text-sm leading-relaxed text-white/60">{intro}</p> : null}
      <div className="mt-6 grid gap-5">{children}</div>
    </section>
  );
}

export default function AIStrategyIntake() {
  const [searchParams] = useSearchParams();
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const formEndpoint = useMemo(resolveFormEndpoint, []);
  const bookingUrl =
    import.meta.env.NEXT_PUBLIC_AI_STRATEGY_BOOKING_URL?.trim() || fallbackBookingUrl;
  const status = searchParams.get("status");
  const receiptId = searchParams.get("receipt_id") || searchParams.get("receiptId") || undefined;
  const isSuccess = status === "success";
  const isError = status === "error";

  useEffect(() => {
    trackEvent("ai_strategy_intake_view", {
      source_page: "ai_strategy_intake",
      status: status || "missing",
    });

    if (isSuccess) {
      trackPendingCheckoutSuccess("/ai-strategy", receiptId);
      trackEvent("checkout_return_success", {
        checkout_area: "ai-strategy",
        status: "success",
      });
    }
  }, [isSuccess, receiptId, status]);

  const handleCopy = async () => {
    trackEvent("answer_later_click", {
      source_page: "ai_strategy_intake",
    });

    try {
      await navigator.clipboard.writeText(intakePageUrl);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState("submitting");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    trackEvent("ai_strategy_intake_submit", {
      source_page: "ai_strategy_intake",
      selected_service: payload.service_purchased,
    });

    try {
      const response = await fetch(formEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          source_page: "ai_strategy_intake",
          submitted_at: new Date().toISOString(),
          page_url: window.location.href,
        }),
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      setSubmitState("success");
      event.currentTarget.reset();
      trackEvent("ai_strategy_intake_success", {
        source_page: "ai_strategy_intake",
        selected_service: payload.service_purchased,
      });
    } catch {
      setSubmitState("error");
      trackEvent("ai_strategy_intake_error", {
        source_page: "ai_strategy_intake",
        selected_service: payload.service_purchased,
      });
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#020403] text-white">
      <SEOHead
        title="AI Strategy Intake | MasterGrowbot AI"
        description="Submit your AI strategy intake details, schedule your session, or answer the preparation questions later."
        canonicalUrl={intakePageUrl}
        ogImage="https://www.mastergrowbot.com/images/ai-strategy/best-technology-awards.png"
      />
      <LandingNav />
      <main className="relative z-10 px-4 py-20 sm:px-6 sm:py-28">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(29,185,84,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(29,185,84,0.06)_1px,transparent_1px)] bg-[size:42px_42px] opacity-35" />
        <div className="absolute left-1/2 top-20 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-landing-green/10 blur-3xl" />

        <section className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-landing-green/24 bg-black/55 p-5 shadow-2xl shadow-landing-green/10 backdrop-blur sm:p-8">
            <p className="inline-flex rounded-full border border-landing-green/30 bg-landing-green/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-landing-green">
              Paid buyer intake
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-white font-sans sm:text-6xl">
              AI Strategy Intake
            </h1>
            <div className="mt-6 rounded-xl border border-gold/30 bg-gold/10 p-4 text-sm font-semibold leading-relaxed text-white/82">
              Don't have time to answer the questions now or want to answer later? Don't worry. All the questions will
              be sent to you after you book your call along with any other details or instructions to ensure we maximize
              our time together. Thank you!
            </div>
            {isSuccess ? (
              <div className="mt-5 rounded-xl border border-landing-green/30 bg-landing-green/10 p-4 text-sm font-semibold leading-relaxed text-white/82">
                Checkout received. Please complete the intake form below or schedule your call now.
              </div>
            ) : null}
            {isError ? (
              <div className="mt-5 rounded-xl border border-gold/30 bg-gold/10 p-4 text-sm font-semibold leading-relaxed text-white/82">
                Checkout was not completed. Please return to AI Strategy and try again or email support@mastergrowbot.com.
              </div>
            ) : null}
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/68">
              Use this page to share the details we need before your strategy session or buildout kickoff, or schedule
              your call and answer the questions later from your calendar invite.
            </p>
          </div>
        </section>

        <section className="mx-auto mt-8 grid max-w-5xl gap-5 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-xl border border-landing-green/22 bg-white/[0.035] p-5 shadow-xl shadow-black/20 sm:p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-landing-green/30 bg-landing-green/10 text-landing-green">
              <CalendarDays className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-white">Schedule your call</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/62">
              Book your session using the calendar below. The booking calendar is set for advance scheduling and
              available business-hour windows.
            </p>
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("booking_link_click", {
                  source_page: "ai_strategy_intake",
                  booking_url: bookingUrl,
                })
              }
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-landing-green px-5 py-3.5 text-sm font-bold text-black transition hover:bg-landing-green/90 focus:outline-none focus:ring-2 focus:ring-landing-green focus:ring-offset-2 focus:ring-offset-black sm:w-auto"
            >
              Schedule Your AI Strategy Session
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/45 p-5 shadow-xl shadow-black/20 sm:p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold">
              <Copy className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-white">Want to answer later?</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/62">
              You can schedule your call now and reply to the calendar invite with your answers when ready. The calendar
              invite includes the same questions so you can respond later by email.
            </p>
            <button
              type="button"
              onClick={handleCopy}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-landing-green/35 bg-landing-green/10 px-5 py-3 text-sm font-bold text-landing-green transition hover:border-landing-green/70 hover:bg-landing-green/15 focus:outline-none focus:ring-2 focus:ring-landing-green focus:ring-offset-2 focus:ring-offset-black"
            >
              Copy intake page link
              <Copy className="h-4 w-4" aria-hidden="true" />
            </button>
            <p className="mt-3 break-all text-xs leading-relaxed text-white/48">{intakePageUrl}</p>
            {copyState === "copied" ? (
              <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-landing-green">
                <CheckCircle className="h-4 w-4" aria-hidden="true" />
                Link copied.
              </p>
            ) : null}
            {copyState === "error" ? (
              <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-gold">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                Copy failed. Use the visible link above.
              </p>
            ) : null}
          </div>
        </section>

        <section className="mx-auto mt-8 max-w-5xl rounded-xl border border-landing-green/18 bg-landing-green/8 p-5 sm:p-6">
          <h2 className="text-xl font-bold text-white">Calendar invite reminder</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/62">
            The booking confirmation includes the pre-call questions. You can reply directly to the calendar invite with
            your answers if you prefer to answer later.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="mx-auto mt-8 grid max-w-5xl gap-6">
          <SectionCard title="Contact Details">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" name="full_name" required />
              <Field label="Email" name="email" type="email" required />
              <Field label="Company / brand name" name="company_name" required />
              <Field label="Website or main business URL" name="website_url" type="url" required />
            </div>
            <SelectField
              label="Which service did you purchase?"
              name="service_purchased"
              required
              options={["AI Opportunity Map Deposit", "Custom AI Agent Buildout Deposit", "Not sure"]}
            />
          </SectionCard>

          <SectionCard title="AI Opportunity Map Questions">
            <TextArea
              label="What is the main business goal you want AI to help with in the next 30 to 90 days?"
              name="main_business_goal"
              required
            />
            <TextArea
              label="What tools are you currently using? Examples: Shopify, WordPress, HubSpot, Airtable, Google Sheets, Zapier, Slack, Notion, custom app."
              name="current_tools"
              required
            />
            <TextArea label="What is the biggest bottleneck in your current workflow?" name="biggest_bottleneck" required />
            <TextArea label="What would make this strategy session a success for you?" name="session_success" required />
            <TextArea
              label="Who should receive the final opportunity map and follow-up notes?"
              name="final_report_recipients"
              required
            />
          </SectionCard>

          <SectionCard
            title="Additional AI Agent Buildout Questions"
            intro="Only complete this section if you purchased or are preparing for the Custom AI Agent Buildout."
          >
            <TextArea
              label="What process do you want the AI agent, workflow, or internal copilot to improve first?"
              name="buildout_process_to_improve"
            />
            <TextArea
              label="Who will use this system? Include team roles and approximate number of users."
              name="buildout_users"
            />
            <TextArea label="What should the first working version be able to do?" name="first_version_capabilities" />
            <TextArea
              label="What should the system never do without human approval?"
              name="human_approval_limits"
            />
            <TextArea
              label="What tools, documents, SOPs, prompts, spreadsheets, support messages, or workflows should we use?"
              name="source_materials"
            />
            <TextArea label="What does a successful launch look like 45 days from now?" name="successful_launch" />
            <TextArea
              label="Are there any security, privacy, compliance, or customer-data restrictions we need to know?"
              name="security_privacy_restrictions"
            />
            <TextArea
              label="Who is the main decision maker for approvals and revisions?"
              name="decision_maker"
            />
          </SectionCard>

          <SectionCard title="Scheduling and Confidentiality">
            <TextArea
              label="Preferred days/times if you cannot use the booking calendar"
              name="preferred_days_times"
            />
            <Field label="Time zone" name="time_zone" placeholder="Example: Central Time" />
            <SelectField label="Do you want an NDA before the call?" name="nda_requested" options={["Yes", "No", "Not sure"]} />
            <TextArea label="Anything else we should know before the call?" name="additional_notes" />
            <div className="rounded-lg border border-landing-green/18 bg-black/35 p-4">
              <p className="flex gap-3 text-sm leading-relaxed text-white/64">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-landing-green" aria-hidden="true" />
                <span>All calls are confidential and private. A signed NDA is available upon request.</span>
              </p>
            </div>
          </SectionCard>

          <div className="rounded-xl border border-white/10 bg-black/45 p-5 sm:p-6">
            {submitState === "success" ? (
              <div className="mb-4 rounded-lg border border-landing-green/30 bg-landing-green/10 p-4 text-sm font-semibold text-landing-green">
                Thank you. Your intake details were submitted. We will review your answers and follow up by email.
              </div>
            ) : null}
            {submitState === "error" ? (
              <div className="mb-4 rounded-lg border border-gold/30 bg-gold/10 p-4 text-sm font-semibold text-white">
                Something went wrong submitting the form. Please try again or email support@mastergrowbot.com.
              </div>
            ) : null}
            <button
              type="submit"
              disabled={submitState === "submitting"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-landing-green px-5 py-3.5 text-sm font-bold text-black transition hover:bg-landing-green/90 focus:outline-none focus:ring-2 focus:ring-landing-green focus:ring-offset-2 focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {submitState === "submitting" ? "Submitting..." : "Submit Intake Details"}
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </form>
      </main>
      <LandingFooter />
    </div>
  );
}
