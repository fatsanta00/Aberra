import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import WithdrawalActionButtons from "@/components/WithdrawalActionButtons";

interface WithdrawalWithUser {
  id: string;
  userId: string;
  crypto: string;
  walletAddress: string;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  user: { username: string; email: string; balance: number };
}
export default async function AdminWithdrawals() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true },
  });

  if (!user?.isAdmin) redirect("/dashboard");

  const withdrawals: WithdrawalWithUser[] = await prisma.withdrawalRequest.findMany({
    include: {
      user: { select: { username: true, email: true, balance: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const pending = withdrawals.filter((w) => w.status === "PENDING").length;
  const approved = withdrawals.filter((w) => w.status === "APPROVED").length;
  const completed = withdrawals.filter((w) => w.status === "COMPLETED").length;
  const rejected = withdrawals.filter((w) => w.status === "REJECTED").length;
  const total = withdrawals.length;

  const statusStyle: Record<string, string> = {
    PENDING: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    APPROVED: "bg-green-500/20 text-green-300 border-green-500/30",
    COMPLETED: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    REJECTED: "bg-red-500/20 text-red-300 border-red-500/30",
  };

  return (
    <div className="min-h-screen bg-[#3b0931]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1c0417]/95 border-b border-red-500/30 h-16 flex items-center px-6">
        <div className="flex items-center justify-between w-full max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-4">
            <span className="text-red-400 font-bold tracking-wider text-sm">🔑 ADMIN PANEL</span>
            <span className="text-gray-500 text-sm">Withdrawal Requests</span>
          </div>
          <Link href="/dashboard" className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm transition">
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="pt-20 max-w-screen-2xl mx-auto px-4 md:px-6 pb-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1c0417]/80 border border-purple-500/20 rounded-2xl p-5">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Total</p>
            <p className="text-3xl font-bold text-white">{total}</p>
          </div>
          <div className="bg-[#1c0417]/80 border border-yellow-500/20 rounded-2xl p-5">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-300">{pending}</p>
          </div>
          <div className="bg-[#1c0417]/80 border border-green-500/20 rounded-2xl p-5">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-300">{approved}</p>
          </div>
          <div className="bg-[#1c0417]/80 border border-blue-500/20 rounded-2xl p-5">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Completed</p>
            <p className="text-3xl font-bold text-blue-300">{completed}</p>
          </div>
        </div>

        {/* Requests table */}
        <div className="bg-[#1c0417]/80 border border-purple-500/20 rounded-2xl overflow-hidden">
          {withdrawals.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No withdrawal requests yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="px-5 py-4 text-gray-400 font-medium whitespace-nowrap">Date</th>
                    <th className="px-5 py-4 text-gray-400 font-medium">User</th>
                    <th className="px-5 py-4 text-gray-400 font-medium">Crypto</th>
                    <th className="px-5 py-4 text-gray-400 font-medium">Wallet Address</th>
                    <th className="px-5 py-4 text-gray-400 font-medium">Amount</th>
                    <th className="px-5 py-4 text-gray-400 font-medium">Status</th>
                    <th className="px-5 py-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map((req) => (
                    <tr key={req.id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="px-5 py-4 text-gray-300 text-xs whitespace-nowrap">
                        {new Date(req.createdAt).toLocaleString()}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-white font-medium">{req.user.username}</p>
                        <p className="text-gray-500 text-xs">{req.user.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
                          {req.crypto}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-gray-300 font-mono text-xs max-w-[180px] truncate" title={req.walletAddress}>
                          {req.walletAddress}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-white font-bold">${req.amount.toFixed(2)}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle[req.status] ?? "bg-gray-500/20 text-gray-300 border-gray-500/30"}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <WithdrawalActionButtons
                          withdrawalId={req.id}
                          currentStatus={req.status}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {rejected > 0 && (
          <p className="text-gray-500 text-xs mt-4">
            * Rejected withdrawals automatically refund the user's balance.
          </p>
        )}
      </main>
    </div>
  );
}
