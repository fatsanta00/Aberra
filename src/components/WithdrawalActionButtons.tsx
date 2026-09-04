"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ActionButtonsProps {
  withdrawalId: string;
  currentStatus: string;
}

const ACTIONS = [
  { label: "Approve", status: "APPROVED", className: "bg-green-500/20 text-green-300 border-green-500/40 hover:bg-green-500/40" },
  { label: "Complete", status: "COMPLETED", className: "bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500/40" },
  { label: "Reject", status: "REJECTED", className: "bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/40" },
];

export default function WithdrawalActionButtons({ withdrawalId, currentStatus }: ActionButtonsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  if (currentStatus === "COMPLETED" || currentStatus === "REJECTED") {
    return <span className="text-gray-600 text-xs">No actions</span>;
  }

  const handleAction = async (status: string) => {
    setLoading(status);
    setError("");
    try {
      const res = await fetch(`/api/admin/withdrawal/${withdrawalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Action failed");
      } else {
        router.refresh(); // Re-fetch server component data — no stale state
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      {error && <p className="text-red-400 text-xs mb-1">{error}</p>}
      <div className="flex gap-1.5 flex-wrap">
        {ACTIONS.filter((a) => {
          // Hide Approve if already approved
          if (currentStatus === "APPROVED" && a.status === "APPROVED") return false;
          return true;
        }).map((action) => (
          <button
            key={action.status}
            onClick={() => handleAction(action.status)}
            disabled={loading !== null}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${action.className}`}
          >
            {loading === action.status ? "..." : action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
