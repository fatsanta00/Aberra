"use client";

import { useState } from "react";

interface StakeFormProps {
  initialBalance: number;
}

const CRYPTOS = [
  { id: "BTC", label: "Bitcoin", icon: "/img2/btcic .png" },
  { id: "ETH", label: "Ethereum", icon: "/img2/ethic.png" },
  { id: "BNB", label: "Binance", icon: "/img2/bnbic.png" },
  { id: "USDT", label: "Tether", icon: "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=029" },
  { id: "SOL", label: "Solana", icon: "https://cryptologos.cc/logos/solana-sol-logo.svg?v=029" },
];

const PLANS = [
  { id: "silver", label: "Silver Plan (30 Days)", min: 100 },
  { id: "gold", label: "Gold Plan (60 Days)", min: 100 },
  { id: "diamond", label: "Diamond Plan (90 Days)", min: 100 },
];

export default function StakeForm({ initialBalance }: StakeFormProps) {
  const [balance, setBalance] = useState(initialBalance);
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>("silver");
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const numAmount = parseFloat(amount) || 0;
  const activePlanDef = PLANS.find((p) => p.id === selectedPlan);
  const minRequired = activePlanDef ? activePlanDef.min : 100;
  
  const amountExceedsBalance = numAmount > balance;
  const amountBelowMin = numAmount > 0 && numAmount < minRequired;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedCrypto) return setError("Please select a cryptocurrency.");
    if (!numAmount || numAmount <= 0) return setError("Please enter a valid amount.");
    if (numAmount < minRequired) return setError(`Minimum amount for this plan is $${minRequired}.`);
    if (numAmount > balance) return setError("Amount exceeds your available balance.");

    setLoading(true);
    try {
      const res = await fetch("/api/stake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crypto: selectedCrypto, plan: selectedPlan, amount: numAmount }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to activate mining plan.");
      } else {
        setSuccess("Mining plan activated successfully!");
        setBalance((b) => b - numAmount);
        setAmount("");
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
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Available Balance</p>
        <p className="text-4xl font-bold text-white">${balance.toFixed(2)}</p>
      </div>

      {/* Crypto Selection */}
      <div className="mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Select Cryptocurrency</p>
        <div className="grid grid-cols-4 gap-3">
          {CRYPTOS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCrypto(c.id)}
              className={`flex flex-col items-center gap-2 py-4 px-2 rounded-xl border transition-all ${
                selectedCrypto === c.id
                  ? "border-[#a855f7] bg-[#a855f7]/20 shadow-lg shadow-purple-900/30"
                  : "border-white/10 bg-[#1c0417]/60 hover:border-white/30"
              }`}
            >
              <img src={c.icon} alt={c.id} className="w-8 h-8 object-contain" />
            </button>
          ))}
        </div>
      </div>

      {/* Feedback messages */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-sm text-center">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded-xl bg-green-500/20 border border-green-500/30 text-green-200 text-sm text-center">{success}</div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Plan</label>
          <div className="relative">
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="w-full px-4 py-3 appearance-none rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#a855f7] transition-all"
            >
              {PLANS.map(p => (
                <option key={p.id} value={p.id} className="bg-[#1c0417] text-white">{p.label}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
              ▼
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Amount (USD)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min={minRequired}
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
            <p className="text-yellow-400 text-xs mt-1">Minimum for this plan is ${minRequired}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || amountExceedsBalance || amountBelowMin || !selectedCrypto}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#c084fc] text-white font-bold tracking-wider hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "CONFIRM STAKE"}
        </button>
      </form>
    </div>
  );
}
