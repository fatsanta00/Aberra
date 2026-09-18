"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TransferMinedButton({ minedBalance }: { minedBalance: number }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleTransfer = async () => {
    if (minedBalance <= 0) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/transfer-mined", {
        method: "POST",
      });
      const data = await res.json();
      
      if (res.ok) {
        alert(data.message);
        router.refresh(); // Refresh the dashboard to get latest balances
      } else {
        alert(data.message || "Failed to transfer");
      }
    } catch (err) {
      alert("Error occurred during transfer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleTransfer}
      disabled={loading || minedBalance <= 0}
      className={`block w-full text-center mt-4 py-2 rounded-lg text-xs font-bold transition ${
        minedBalance > 0 
          ? "bg-[#facc15] text-black hover:opacity-90" 
          : "bg-white/10 text-white/50 cursor-not-allowed"
      }`}
    >
      {loading ? "Transferring..." : "Transfer to Main Balance"}
    </button>
  );
}
