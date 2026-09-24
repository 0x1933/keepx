import { describe, expect, it } from "vitest";
import { transactionReducer } from "@/lib/transactions";

describe("transaction lifecycle", () => {
  it("walks through the signing path as explicit user-visible stages", () => {
    let stage = transactionReducer("idle", { type: "BUILD" });
    stage = transactionReducer(stage, { type: "SIMULATE" });
    stage = transactionReducer(stage, { type: "READY" });
    stage = transactionReducer(stage, { type: "REQUEST_SIGNATURE" });
    stage = transactionReducer(stage, { type: "SUBMIT" });
    stage = transactionReducer(stage, { type: "CONFIRM" });
    stage = transactionReducer(stage, { type: "RESOLVE" });

    expect(stage).toBe("confirmed");
  });
});
