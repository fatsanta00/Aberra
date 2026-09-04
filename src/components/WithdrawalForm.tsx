"use client";

import { useState } from "react";

interface WithdrawalFormProps {
  initialBalance: number;
  username: string;
}

const CRYPTOS = [
  { id: "BTC", label: "Bitcoin", shortLabel: "BTC" },
  { id: "ETH", label: "Ethereum", shortLabel: "ETH" },
  { id: "USDT", label: "Tether", shortLabel: "USDT" },
  { id: "BSC", label: "Binance Smart Chain", shortLabel: "BSC" },
];

export default function WithdrawalForm({ initialBalance, username }: WithdrawalFormProps) {
  const [balance, setBalance] = useState(initialBalance);
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const numAmount = parseFloat(amount) || 0;
  const amountExceedsBalance = numAmount > balance;
  const amountBelowMin = numAmount > 0 && numAmount < 750;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedCrypto) return setError("Please select a cryptocurrency.");
    if (!walletAddress.trim()) return setError("Please enter a wallet address.");
    if (!numAmount || numAmount <= 0) return setError("Please enter a valid amount.");
    if (numAmount < 750) return setError("Minimum withdrawal amount is $750.");
    if (numAmount > balance) return setError("Amount exceeds your available balance.");

    setLoading(true);
    try {
      const res = await fetch("/api/withdrawal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crypto: selectedCrypto, walletAddress: walletAddress.trim(), amount: numAmount }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Withdrawal request failed.");
      } else {
        setSuccess("Withdrawal request submitted successfully! Status: Pending.");
        setBalance((b) => b - numAmount);
        setAmount("");
        setWalletAddress("");
        setSelectedCrypto(null);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Balance Card */}
      <div className="bg-[#1c0417]/80 border border-purple-500/20 rounded-2xl p-6 text-center mb-8">
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Balance</p>
        <p className="text-4xl font-bold text-white">${balance.toFixed(2)}</p>
      </div>

      {/* Crypto Selection */}
      <div className="mb-6">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Select Cryptocurrency</p>
        <div className="grid grid-cols-4 gap-3">
          {CRYPTOS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCrypto(c.id)}
              className={`flex flex-col items-center gap-1.5 py-4 px-2 rounded-xl border transition-all ${
                selectedCrypto === c.id
                  ? "border-[#a855f7] bg-[#a855f7]/20 shadow-lg shadow-purple-900/30"
                  : "border-white/10 bg-[#1c0417]/60 hover:border-white/30"
              }`}
            >
              <span className="text-lg font-bold text-white">{c.shortLabel}</span>
              <span className="text-[10px] text-gray-400 hidden sm:block text-center leading-tight">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Min withdrawal notice */}
      <div className="bg-[#1c0417]/60 border border-yellow-500/20 rounded-xl px-4 py-3 mb-6 text-center">
        <p className="text-yellow-300 text-sm font-medium">Minimum withdrawal = $750</p>
      </div>

      {/* Feedback messages */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-sm text-center">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded-xl bg-green-500/20 border border-green-500/30 text-green-200 text-sm text-center">{success}</div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Input Address</label>
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="Enter wallet address"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#a855f7] transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Amount (USD)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min="750"
            step="0.01"
            className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
              amountExceedsBalance
                ? "border-red-500/60 focus:ring-red-500"
                : amountBelowMin
                ? "border-yellow-500/60 focus:ring-yellow-500"
                : "border-white/20 focus:ring-[#a855f7]"
            }`}
            required
          />
          {amountExceedsBalance && (
            <p className="text-red-400 text-xs mt-1">Amount exceeds your balance of ${balance.toFixed(2)}</p>
          )}
          {amountBelowMin && !amountExceedsBalance && (
            <p className="text-yellow-400 text-xs mt-1">Minimum withdrawal is $750</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || amountExceedsBalance || amountBelowMin || !selectedCrypto || !walletAddress}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#c084fc] text-white font-bold tracking-wider hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "CONFIRM"}
        </button>
      </form>
    </div>
  );
}
