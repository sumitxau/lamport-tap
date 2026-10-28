"use client";

import { useState } from "react";
import { DROP_OPTIONS_SOL, DEFAULT_DROP_SOL } from "@/config/constants";
import { requestDevnetSol } from "@/services/faucetService";

export default function HomePage() {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(DEFAULT_DROP_SOL);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "", tx: "" });

  async function handleAirdrop(e) {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: "info", message: `Requesting ${amount} Devnet SOL...`, tx: "" });

    try {
      const signature = await requestDevnetSol(address, amount);
      setStatus({
        type: "success",
        message: `Delivered ${amount} SOL to your Devnet wallet!`,
        tx: signature,
      });
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || "Airdrop rate-limited. Try again shortly.",
        tx: "",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="page-shell">
      <header className="navbar">
        <div className="brand-group">
          <span className="status-dot" />
          <span className="brand-title">Lamport Tap</span>
          <span className="badge">DEVNET</span>
        </div>
        <span className="field-label">Solana Devnet Dispenser</span>
      </header>

      <main className="main-container">
        <form onSubmit={handleAirdrop} className="faucet-card">
          <div>
            <h1 className="card-title">Request Devnet SOL</h1>
            <p className="card-subtitle">
              Instant Devnet liquidity for testing SPL Token-2022 & Anchor programs.
            </p>
          </div>

          <div className="field-group">
            <label className="field-label">RECIPIENT WALLET ADDRESS</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Paste Solana address (e.g. F3Fe...)"
              className="input-field"
            />
          </div>

          <div className="field-group">
            <label className="field-label">SELECT AMOUNT</label>
            <div className="pill-row">
              {DROP_OPTIONS_SOL.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`amount-pill ${amount === val ? "amount-pill-active" : ""}`}
                >
                  {val} SOL
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? "Sending SOL..." : `Send ${amount} Devnet SOL`}
          </button>

          {status.message && (
            <div
              className={`status-box ${
                status.type === "error"
                  ? "status-error"
                  : status.type === "success"
                  ? "status-success"
                  : ""
              }`}
            >
              <p>{status.message}</p>
              {status.tx && (
                <a
                  href={`https://explorer.solana.com/tx/${status.tx}?cluster=devnet`}
                  target="_blank"
                  rel="noreferrer"
                  className="explorer-link"
                >
                  View on Solana Explorer →
                </a>
              )}
            </div>
          )}
        </form>
      </main>

      <footer className="footer">Lamport Tap . Solana Devnet fauncet </footer>
    </div>
  );
}