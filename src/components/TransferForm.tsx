"use client";

import { useState } from "react";

interface TransferFormProps {
  initialBalance: number;
}

export default function TransferForm({ initialBalance }: TransferFormProps) {
  const [balance, setBalance] = useState(initialBalance);
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const numAmount = parseFloat(amount) || 0;
  const amountExceedsBalance = numAmount > balance;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) return setError("Please enter a recipient email.");
    if (!numAmount || numAmount <= 0) return setError("Please enter a valid amount.");
    if (numAmount > balance) return setError("Amount exceeds your available balance.");

    setLoading(true);
    try {
      const res = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), amount: numAmount }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Transfer failed.");
      } else {
        setSuccess("Transfer successful!");
        setBalance((b) => b - numAmount);
        setAmount("");
        setEmail("");
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
          <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Recipient Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="recipient@example.com"
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
            min="0.01"
            step="0.01"
            className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
              amountExceedsBalance
                ? "border-red-500/60 focus:ring-red-500"
                : "border-white/20 focus:ring-[#a855f7]"
            }`}
            required
          />
          {amountExceedsBalance && (
            <p className="text-red-400 text-xs mt-1">Amount exceeds your balance of ${balance.toFixed(2)}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || amountExceedsBalance}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#c084fc] text-white font-bold tracking-wider hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "CONFIRM TRANSFER"}
        </button>
      </form>
    </div>
  );
}
