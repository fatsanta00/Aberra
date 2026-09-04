"use client";

import { useState } from "react";
import Image from "next/image";

const WALLETS = [
  { name: "Bitcoin", address: "bc1qtjr4wf2pw4jl0mychvun5h6f6qu3d66n35fe38", icon: "/img2/btcic .png", color: "border-orange-500/50 hover:border-orange-500" },
  { name: "Ethereum", address: "0x96533aa9e98f02F18214c7E271F81E17f3A8A800", icon: "/img2/ethic.png", color: "border-blue-500/50 hover:border-blue-500" },
  { name: "BNB Smart Chain", address: "0x96533aa9e98f02F18214c7E271F81E17f3A8A800", icon: "/img2/bnbic.png", color: "border-yellow-500/50 hover:border-yellow-500" },
  { name: "USDT", address: "0x96533aa9e98f02F18214c7E271F81E17f3A8A800", icon: "/img2/ltcic.png", color: "border-teal-500/50 hover:border-teal-500" }, // Reusing ltcicon for usdt for now
  { name: "Solana", address: "GBb2sBp534w7FsZAmJaZMzm2yZyc22HZ3zyqqU4eeDjr", icon: "/img2/dogeic.png", color: "border-purple-500/50 hover:border-purple-500" },
];

export default function Deposit() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (address: string, index: number) => {
    navigator.clipboard.writeText(address);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Deposit Crypto</h1>
        <p className="text-gray-400 text-sm mt-1">Send crypto to your unique wallet addresses below to fund your account.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Col: Wallets */}
        <div className="space-y-4">
          {WALLETS.map((wallet, idx) => (
            <div key={wallet.name} className={`bg-[#1c0417]/80 border ${wallet.color} rounded-2xl p-5 flex items-center justify-between transition-all group`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 p-2">
                  <img src={wallet.icon} alt={wallet.name} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-white font-bold">{wallet.name}</h3>
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

        {/* Right Col: Fiat Widget */}
        <div className="flex flex-col items-center">
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
    </div>
  );
}
