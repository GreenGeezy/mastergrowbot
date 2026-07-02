import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type AnalyticsParams, trackEvent } from "@/lib/analytics";

type WhopCheckoutMessage = {
  __scope?: string;
  event?: string;
  state?: string;
  plan_id?: string;
  receipt_id?: string;
  setup_intent_id?: string;
  [key: string]: unknown;
};

type UseWhopCheckoutTrackingArgs = {
  planId?: string;
  payload: AnalyticsParams;
  onComplete: (completedPlanId: string, receiptId: string | undefined, signalSource: string) => void;
  onStateChange?: (state: string, signalSource: string) => void;
  loadTimeoutMs?: number;
};

function isWhopOrigin(origin: string) {
  try {
    const { hostname } = new URL(origin);
    return hostname === "whop.com" || hostname.endsWith(".whop.com");
  } catch {
    return false;
  }
}

function isWhopCheckoutMessage(data: unknown): data is WhopCheckoutMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    "__scope" in data &&
    (data as WhopCheckoutMessage).__scope === "whop-embedded-checkout"
  );
}

export function useWhopCheckoutTracking({
  planId,
  payload,
  onComplete,
  onStateChange,
  loadTimeoutMs = 15000,
}: UseWhopCheckoutTrackingArgs) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const completedKeysRef = useRef(new Set<string>());
  const lastStateRef = useRef<string | null>(null);
  const readyRef = useRef(false);
  const [checkoutState, setCheckoutState] = useState("loading");

  const payloadKey = useMemo(() => JSON.stringify(payload), [payload]);
  const currentPayloadRef = useRef(payload);

  useEffect(() => {
    currentPayloadRef.current = payload;
  }, [payloadKey, payload]);

  const trackState = useCallback(
    (state: string, signalSource: string) => {
      const normalizedState = state.toLowerCase();

      if (lastStateRef.current === normalizedState) {
        return;
      }

      lastStateRef.current = normalizedState;
      setCheckoutState(normalizedState);

      if (normalizedState === "ready") {
        readyRef.current = true;
      }

      trackEvent(`whop_checkout_${normalizedState}`, {
        ...currentPayloadRef.current,
        checkout_state: normalizedState,
        whop_signal_source: signalSource,
      });

      onStateChange?.(normalizedState, signalSource);
    },
    [onStateChange],
  );

  const trackComplete = useCallback(
    (completedPlanId: string | undefined, receiptId: string | undefined, signalSource: string) => {
      const resolvedPlanId = completedPlanId || planId;
      if (!resolvedPlanId) {
        return;
      }

      const completionKey = receiptId ? `receipt:${receiptId}` : `plan:${resolvedPlanId}`;
      if (completedKeysRef.current.has(completionKey)) {
        return;
      }

      completedKeysRef.current.add(completionKey);
      onComplete(resolvedPlanId, receiptId, signalSource);
    },
    [onComplete, planId],
  );

  useEffect(() => {
    if (!planId) {
      return;
    }

    readyRef.current = false;
    const startedAt = performance.now();
    const timeoutId = window.setTimeout(() => {
      if (readyRef.current) {
        return;
      }

      trackEvent("whop_checkout_load_timeout", {
        ...currentPayloadRef.current,
        elapsed_ms: Math.round(performance.now() - startedAt),
      });
    }, loadTimeoutMs);

    return () => window.clearTimeout(timeoutId);
  }, [loadTimeoutMs, payloadKey, planId]);

  useEffect(() => {
    if (!planId) {
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      if (!isWhopOrigin(event.origin) || !isWhopCheckoutMessage(event.data)) {
        return;
      }

      if (event.data.event === "state" && event.data.state) {
        trackState(String(event.data.state), "post_message");
      }

      if (event.data.event === "complete") {
        trackComplete(event.data.plan_id, event.data.receipt_id || event.data.setup_intent_id, "post_message");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [planId, trackComplete, trackState]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !planId) {
      return;
    }

    const trackedFrames = new WeakSet<HTMLIFrameElement>();
    const handleIframeLoad = (iframe: HTMLIFrameElement) => {
      if (trackedFrames.has(iframe)) {
        return;
      }

      trackedFrames.add(iframe);
      trackEvent("whop_checkout_iframe_loaded", currentPayloadRef.current);
    };

    const wireIframes = () => {
      host.querySelectorAll("iframe").forEach((iframe) => {
        if (!(iframe instanceof HTMLIFrameElement) || trackedFrames.has(iframe)) {
          return;
        }

        iframe.addEventListener("load", () => handleIframeLoad(iframe), { once: true });
      });
    };

    wireIframes();

    const observer = new MutationObserver(wireIframes);
    observer.observe(host, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [payloadKey, planId]);

  return {
    checkoutState,
    handleComplete: trackComplete,
    handleStateChange: trackState,
    hostRef,
  };
}
