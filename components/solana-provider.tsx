"use client";

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { useMemo, type ReactNode } from "react";
import "@solana/wallet-adapter-react-ui/styles.css";

function rpcEndpoint(): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/solana-rpc`;
  }
  return "https://api.mainnet-beta.solana.com";
}

export default function SolanaProvider({ children }: { children: ReactNode }) {
  const endpoint = useMemo(() => rpcEndpoint(), []);
  const config = useMemo(
    () => ({
      commitment: "confirmed" as const,
      wsEndpoint: "wss://api.mainnet-beta.solana.com",
    }),
    [],
  );

  return (
    <ConnectionProvider endpoint={endpoint} config={config}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
