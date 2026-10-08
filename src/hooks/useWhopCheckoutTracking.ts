import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type AnalyticsParams, trackEvent } from "@/lib/analytics";

type UseWhopCheckoutTrackingArgs = {
  planId?: string;
  payload: AnalyticsParams;
  onComplete: (completedPlanId: string, receiptId: string | undefined, signalSource: string) => void;
  onStateChange?: (state: string, signalSource: string) => void;
  loadTimeoutMs?: number;
};

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
      // Elements' typed payment callback supplies the actual payment ID.
      // Return URLs, waitlists, setup intents and legacy messages are not sales.
      if (signalSource !== "elements_on_complete" || !receiptId || !/^pay_[A-Za-z0-9]+$/.test(receiptId)) return;
      const resolvedPlanId = completedPlanId || planId;
      if (!resolvedPlanId || (planId && resolvedPlanId !== planId)) {
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

      setCheckoutState("timeout");
      trackEvent("whop_checkout_load_timeout", {
        ...currentPayloadRef.current,
        elapsed_ms: Math.round(performance.now() - startedAt),
      });
    }, loadTimeoutMs);

    return () => window.clearTimeout(timeoutId);
  }, [loadTimeoutMs, payloadKey, planId]);

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
