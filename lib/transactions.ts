export type TransactionStage =
  | "idle"
  | "building"
  | "simulating"
  | "ready"
  | "awaiting_wallet"
  | "submitted"
  | "confirming"
  | "confirmed"
  | "failed";

export type TransactionEvent =
  | { type: "BUILD" }
  | { type: "SIMULATE" }
  | { type: "READY" }
  | { type: "REQUEST_SIGNATURE" }
  | { type: "SUBMIT" }
  | { type: "CONFIRM" }
  | { type: "RESOLVE" }
  | { type: "FAIL" }
  | { type: "RESET" };

export function transactionReducer(stage: TransactionStage, event: TransactionEvent): TransactionStage {
  switch (event.type) {
    case "BUILD":
      return "building";
    case "SIMULATE":
      return "simulating";
    case "READY":
      return "ready";
    case "REQUEST_SIGNATURE":
      return "awaiting_wallet";
    case "SUBMIT":
      return "submitted";
    case "CONFIRM":
      return "confirming";
    case "RESOLVE":
      return "confirmed";
    case "FAIL":
      return "failed";
    case "RESET":
      return "idle";
  }
}

export const transactionLabels: Record<TransactionStage, string> = {
  idle: "Idle",
  building: "Building",
  simulating: "Simulating",
  ready: "Ready to sign",
  awaiting_wallet: "Awaiting wallet",
  submitted: "Submitted",
  confirming: "Confirming",
  confirmed: "Confirmed",
  failed: "Failed"
};
