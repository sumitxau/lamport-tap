import { NextResponse } from "next/server";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getConnection } from "@/lib/solana";


const MY_WALLET = "F3FeCPujtrVpLyNynmXQTAM4okuvMmi9TyTFziMRaFyL";
const AIRDROP_SOL = 1;

    
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (
    cronSecret &&
    request.headers.get("authorization") !== `Bearer ${cronSecret}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const connection = getConnection();
    const pubkey = new PublicKey(MY_WALLET);

    const signature = await connection.requestAirdrop(
      pubkey,
      AIRDROP_SOL * LAMPORTS_PER_SOL
    );
    const balanceLamports = await connection.getBalance(pubkey);

    return NextResponse.json({
      success: true,
      wallet: MY_WALLET,
      airdroppedSol: AIRDROP_SOL,
      currentBalanceSol: balanceLamports / LAMPORTS_PER_SOL,
      signature,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Cron airdrop rate-limited";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  }