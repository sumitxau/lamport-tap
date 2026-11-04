import { NextResponse } from "next/server";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

const MY_WALLET = "F3FeCPujtrVpLyNynmXQTAM4okuvMmi9TyTFziMRaFyL";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rpcUrl =
      process.env.ALCHEMY_DEVNET_RPC_URL || "https://api.devnet.solana.com";
    const connection = new Connection(rpcUrl, "confirmed");
    const pubkey = new PublicKey(MY_WALLET);

    const signature = await connection.requestAirdrop(
      pubkey,
      1 * LAMPORTS_PER_SOL
    );

    const balanceLamports = await connection.getBalance(pubkey);

    return NextResponse.json({
      success: true,
      wallet: MY_WALLET,
      airdroppedSol: 1,
      currentBalanceSol: balanceLamports / LAMPORTS_PER_SOL,
      signature,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message || "Cron airdrop rate-limited" },
      { status: 500 }
    );
  }
}