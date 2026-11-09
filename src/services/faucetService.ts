import type { DropAmountSol } from "@/config/constants";

type AirdropResponse = {
  signature?: string;
  error?: string;
}
export async function requestDevnetSol(walletAddress:String, 
  amountSol: DropAmountSol
): Promise<string> {

  const res = await fetch("/api/airdrop", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      address: walletAddress,
      amount: amountSol,
    }),
  });

const data = (await res.json().catch(() => ({}))) as AirdropResponse;


  if (!res.ok) {
    throw new Error(data.error || "Airdrop request failed.");
  }

  if (!data.signature) {
    throw new Error("Airdrop succeeded but no signature was returned.");
  }

  return data.signature;
}