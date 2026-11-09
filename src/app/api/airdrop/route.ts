import { NextResponse } from "next/server";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { DROP_OPTIONS_SOL, type DropAmountSol } from "@/config/constants";
import { getConnection } from "@/lib/solana";

function isDropAmount(value: unknown): value is DropAmountSol {
  return DROP_OPTIONS_SOL.some((option) => option === value);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const { address, amount } = (body ?? {}) as {
    address?: unknown;
    amount?: unknown;
  };

  if (typeof address !== "string" || address.trim() === "") {
    return NextResponse.json(
      { error: "Please enter a wallet address." },
      { status: 400 }
    );
  }

  if (!isDropAmount(amount)) {
    return NextResponse.json(
      { error: `Amount must be one of: ${DROP_OPTIONS_SOL.join(", ")} SOL.` },
      { status: 400 }
    );
  }

  let recipient: PublicKey;
  try {
    recipient = new PublicKey(address.trim());
  } catch {
    return NextResponse.json(
      { error: "Invalid Solana wallet address format." },
      { status: 400 }
    );
  }

  try {
    const connection = getConnection();
    const signature = await connection.requestAirdrop(
      recipient,
      Math.round(amount * LAMPORTS_PER_SOL)
    );
    return NextResponse.json({ signature });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Airdrop failed on Devnet RPC.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}