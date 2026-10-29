export async function requestDevnetSol(walletAddressString, amountSol) {
  const res = await fetch("/api/airdrop", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      address: walletAddressString,
      amount: amountSol,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Airdrop request failed.");
  }

  return data.signature;
}