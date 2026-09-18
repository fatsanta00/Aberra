"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const WALLETS = [
  { id: "BTC", name: "Bitcoin", network: "BTC", address: "bc1qtjr4wf2pw4jl0mychvun5h6f6qu3d66n35fe38", icon: "/img2/btcic .png", color: "border-orange-500/50 hover:border-orange-500" },
  { id: "ETH", name: "Ethereum", network: "ERC20", address: "0x96533aa9e98f02F18214c7E271F81E17f3A8A800", icon: "/img2/ethic.png", color: "border-blue-500/50 hover:border-blue-500" },
  { id: "BNB", name: "BNB Smart Chain", network: "BEP20", address: "0x96533aa9e98f02F18214c7E271F81E17f3A8A800", icon: "/img2/bnbic.png", color: "border-yellow-500/50 hover:border-yellow-500" },
  { id: "USDT", name: "USDT", network: "ERC20", address: "0x96533aa9e98f02F18214c7E271F81E17f3A8A800", icon: "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=029", color: "border-teal-500/50 hover:border-teal-500" }, 
  { id: "SOL", name: "Solana", network: "Solana", address: "GBb2sBp534w7FsZAmJaZMzm2yZyc22HZ3zyqqU4eeDjr", icon: "https://cryptologos.cc/logos/solana-sol-logo.svg?v=029", color: "border-purple-500/50 hover:border-purple-500" },
];

export default function Deposit() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const [amount, setAmount] = useState("");
  const [crypto, setCrypto] = useState("BTC");
  const [network, setNetwork] = useState("BTC");
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const router = useRouter();

  const copyToClipboard = (address: string, index: number) => {
    navigator.clipboard.writeText(address);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCryptoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCrypto = e.target.value;
    setCrypto(selectedCrypto);
    
    // Automatically set the network based on crypto
    const wallet = WALLETS.find(w => w.id === selectedCrypto);
    if (wallet) {
      setNetwork(wallet.network);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, crypto, network, txHash }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: data.message, type: "success" });
        setAmount("");
        setTxHash("");
        router.refresh();
      } else {
        setMessage({ text: data.message || "Failed to submit deposit", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "An error occurred during submission", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Deposit Crypto</h1>
        <p className="text-gray-400 text-sm mt-1">Send crypto to your unique wallet addresses below and submit the transaction details to fund your account.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left Col: Wallets */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">1. Send Payment</h2>
          {WALLETS.map((wallet, idx) => (
            <div key={wallet.name} className={`bg-[#1c0417]/80 border ${wallet.color} rounded-2xl p-5 flex items-center justify-between transition-all group`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 p-2">
                  <img src={wallet.icon} alt={wallet.name} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-white font-bold">{wallet.name} ({wallet.network})</h3>
                  <p className="text-gray-400 font-mono text-xs hidden sm:block truncate max-w-[200px] md:max-w-xs">{wallet.address}</p>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(wallet.address, idx)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition flex items-center gap-2"
              >
                {copiedIndex === idx ? (
                  <span className="text-green-400">Copied!</span>
                ) : (
                  "Copy"
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Right Col: Deposit Form */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">2. Submit Transaction Details</h2>
          <div className="bg-[#1c0417]/80 border border-purple-500/20 rounded-3xl p-6 shadow-xl shadow-purple-900/20 w-full">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {message && (
                <div className={`p-4 rounded-xl text-sm font-semibold ${message.type === "success" ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
                  {message.text}
                </div>
              )}

              <div>
                <label className="block text-gray-400 text-sm font-semibold mb-2">Cryptocurrency</label>
                <select
                  value={crypto}
                  onChange={handleCryptoChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                  required
                >
                  {WALLETS.map(w => (
                    <option key={w.id} value={w.id} className="text-black">{w.name} ({w.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-semibold mb-2">Network</label>
                <input
                  type="text"
                  value={network}
                  disabled
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Network is automatically selected based on cryptocurrency.</p>
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-semibold mb-2">Amount Deposited (USD Value)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-semibold mb-2">Transaction Hash</label>
                <input
                  type="text"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="Paste the transaction hash..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-bold transition ${loading ? "bg-purple-500/50 text-white/50 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 text-white"}`}
              >
                {loading ? "Submitting..." : "Submit Deposit"}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Third Row: Fiat Widget */}
      <div className="flex flex-col items-center mt-12">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white uppercase">Buy <span className="text-[#a855f7]">Crypto</span> With Fiat</h2>
            <p className="text-gray-400 text-sm mt-1">Use your credit card to buy crypto instantly</p>
          </div>
          <div className="bg-[#1c0417]/80 border border-purple-500/20 rounded-3xl p-4 shadow-xl shadow-purple-900/20 w-full max-w-[500px] overflow-hidden flex justify-center">
            <iframe
              width="100%"
              height="450"
              frameBorder="0"
              src="https://widget.changelly.com?from=usd&to=btc%2Cbnbbsc%2Cbnb%2Ceth%2Cdoge%2Cltc&amount=100&address=&fromDefault=usd&toDefault=btc&merchant_id=ISQHTB0wcbsg0fXd&payment_id=&v=3&type=no-rev-share&color=5f41ff&headerId=1&logo=visible&buyButtonTextId=1"
              className="max-w-full rounded-2xl"
              title="Changelly Widget"
            >
              Cannot load widget
            </iframe>
          </div>
      </div>
    </div>
  );
}
