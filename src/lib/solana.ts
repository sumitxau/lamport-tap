import { Connection } from "@solana/web3.js";

export function getConnection(): Connection {
  const rpcUrl = process.env.ALCHEMY_DEVNET_RPC_URL;
  if (!rpcUrl) {
    throw new Error("Server is missing ALCHEMY_DEVNET_RPC_URL.");
  }
  return new Connection(rpcUrl, "confirmed");
}