import { describe, expect, it, vi } from "vitest";
import { parseSlippageBps } from "@/lib/raydium/config";
import { allowlistedPools } from "@/lib/pools";
import { sendPreparedTransaction } from "@/lib/raydium/clmm-wallet";
import type { Connection } from "@solana/web3.js";
import { Transaction } from "@solana/web3.js";

describe("pool allowlist honesty", () => {
  it("only publishes the verified SOL/USDC Raydium CLMM pool", () => {
    expect(allowlistedPools).toHaveLength(1);
    expect(allowlistedPools[0]?.id).toBe("2QdhepnKRTLjjSqPL1PtKNwqrUkoLee5Gqs8bvZhRdMv");
    expect(allowlistedPools[0]?.pair).toBe("SOL / USDC");
    expect(allowlistedPools[0]?.feeTier).toBe("0.05%");
    expect(allowlistedPools[0]?.status).toBe("verified");
  });
});

describe("parseSlippageBps", () => {
  it("accepts bounded finite values and rejects invalid inputs", () => {
    expect(parseSlippageBps(50)).toBe(50);
    expect(parseSlippageBps(undefined)).toBe(50);
    expect(() => parseSlippageBps(-50)).toThrow(/between/);
    expect(() => parseSlippageBps(20000)).toThrow(/between/);
    expect(() => parseSlippageBps(Number.NaN)).toThrow(/finite/);
  });
});

describe("sendPreparedTransaction confirmation", () => {
  it("returns the signature when confirmation has no error", async () => {
    const tx = new Transaction();
    const sendTransaction = vi.fn().mockResolvedValue("mock-signature");
    const connection = {
      confirmTransaction: vi.fn().mockResolvedValue({ value: { err: null } })
    } as unknown as Connection;

    await expect(sendPreparedTransaction(tx, connection, sendTransaction)).resolves.toBe("mock-signature");
  });

  it("throws when confirmation reports an on-chain execution error", async () => {
    const tx = new Transaction();
    const sendTransaction = vi.fn().mockResolvedValue("mock-signature");
    const connection = {
      confirmTransaction: vi.fn().mockResolvedValue({
        value: { err: { InstructionError: [0, { Custom: 1 }] } }
      })
    } as unknown as Connection;

    await expect(sendPreparedTransaction(tx, connection, sendTransaction)).rejects.toThrow(/failed on-chain/);
  });
});
