"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { VISIT_REFERRER_KEY, VISIT_SESSION_KEY } from "@/lib/visit-beacon";

const SESSION_KEY = VISIT_SESSION_KEY;
const REFERRER_KEY = VISIT_REFERRER_KEY;

type VisitBeaconProps = {
  /** HTTP Referer from the document request (more reliable than document.referrer in in-app browsers). */
  initialReferrer?: string;
};

function persistReferrer(referrer: string | undefined): string | undefined {
  const value = referrer?.trim();
  if (!value) return undefined;
  try {
    sessionStorage.setItem(REFERRER_KEY, value);
  } catch {
    // ignore quota / private mode
  }
  return value;
}

function readStoredReferrer(): string | undefined {
  try {
    return sessionStorage.getItem(REFERRER_KEY)?.trim() || undefined;
  } catch {
    return undefined;
  }
}

function resolveReferrer(initialReferrer?: string): string | undefined {
  const fromServer = initialReferrer?.trim();
  if (fromServer) return persistReferrer(fromServer);

  const fromDocument = document.referrer?.trim();
  if (fromDocument) return persistReferrer(fromDocument);

  return readStoredReferrer();
}

function shouldLogReferrer(path: string, isFirstInSession: boolean): boolean {
  return isFirstInSession || path.startsWith("/advancedSearch");
}

/**
 * Logs the first visit and each in-app page navigation (once per path change).
 * IP / geo are read server-side from request headers.
 */
export function VisitBeacon({ initialReferrer }: VisitBeaconProps) {
  const pathname = usePathname();
  const lastLoggedPath = useRef<string | null>(null);
  const documentReferrerRef = useRef(initialReferrer);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const pathWithSearch =
      (pathname || window.location.pathname) +
      (window.location.search || "");

    if (lastLoggedPath.current === pathWithSearch) return;
    lastLoggedPath.current = pathWithSearch;

    const isFirstInSession = !sessionStorage.getItem(SESSION_KEY);
    if (isFirstInSession) sessionStorage.setItem(SESSION_KEY, "1");

    const includeReferrer = shouldLogReferrer(pathWithSearch, isFirstInSession);

    void (async () => {
      try {
        await fetch("/api/visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: pathWithSearch,
            origin: `${window.location.origin}${pathWithSearch}`,
            referrer: includeReferrer
              ? resolveReferrer(documentReferrerRef.current)
              : undefined,
            kind: isFirstInSession ? "entry" : "navigation",
          }),
          keepalive: true,
        });
      } catch {
        // non-blocking
      }
    })();
  }, [pathname]);

  return null;
}
