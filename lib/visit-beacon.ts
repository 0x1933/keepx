export const VISIT_SESSION_KEY =
  process.env.NEXT_PUBLIC_VISIT_SESSION_KEY?.trim() || "visit-beacon";

export const VISIT_REFERRER_KEY = `${VISIT_SESSION_KEY}:referrer`;
