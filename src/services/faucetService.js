import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { DEVNET_RPC_URL } from "@/config/constants";

export async function requestDevnetSol(walletAddressString, amountSol) {
  if (!walletAddressString || walletAddressString.trim() === "") {
    throw new Error("Please enter a valid Solana wallet address.");
  }

  let recipientPubkey;
  try {
    recipientPubkey = new PublicKey(walletAddressString.trim());
  } catch {
    throw new Error("Invalid Solana wallet address format.");
  }

  const connection = new Connection(DEVNET_RPC_URL, "confirmed");
  const lamports = amountSol * LAMPORTS_PER_SOL;

 
  const signature = await connection.requestAirdrop(recipientPubkey, lamports);

  const latestBlockhash = await connection.getLatestBlockhash();
  await connection.confirmTransaction({
    signature,
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
  });

  return signature;
}