import { NextResponse } from "next/server";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

export async function POST(request) {
  try {
    const { address, amount } = await request.json();

    if (!address || !amount || Number(amount) > 2) {
      return NextResponse.json(
        { error: "Please enter a valid address and amount." },
        { status: 400 }
      );
    }

    let recipientPubkey;
    try {
      recipientPubkey = new PublicKey(address.trim());
    } catch {
      return NextResponse.json(
        { error: "Invalid Solana wallet address format." },
        { status: 400 }
      );
    }

    const rpcUrl =
      process.env.ALCHEMY_DEVNET_RPC_URL || "https://api.devnet.solana.com";
    const connection = new Connection(rpcUrl, "confirmed");

    const signature = await connection.requestAirdrop(
      recipientPubkey,
      Number(amount) * LAMPORTS_PER_SOL
    );

    const latestBlockhash = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      signature,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    });

    return NextResponse.json({ signature });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Airdrop failed on Devnet RPC." },
      { status: 500 }
    );
  }
}