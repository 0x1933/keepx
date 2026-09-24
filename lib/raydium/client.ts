import "server-only";
import { Connection } from "@solana/web3.js";

export function createSolanaConnection() {
  return new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.mainnet-beta.solana.com", "confirmed");
}

export async function loadRaydiumSdk() {
  const raydium = await import("@raydium-io/raydium-sdk-v2");
  return raydium;
}
