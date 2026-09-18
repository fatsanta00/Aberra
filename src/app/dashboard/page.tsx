import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { syncUserStaking } from "@/services/stakingService";

import TransferMinedButton from "./TransferMinedButton";

interface TransactionWithWithdrawal {
  id: string;
  userId: string;
  type: string;
  amount: number;
  status: string;
  withdrawalRequestId: string | null;
  withdrawalRequest: { id: string; status: string } | null;
  createdAt: Date;
}

interface UserWithRelations {
  id: string;
  username: string;
  email: string;
  balance: number;
  minedBalance: number;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  transactions: TransactionWithWithdrawal[];
  withdrawalRequests: { id: string; status: string; createdAt: Date }[];
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  // Lazy Evaluate: Synchronize all active staking plans (mint rewards, mature plans) BEFORE rendering
  await syncUserStaking(session.user.id);

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      transactions: { 
        orderBy: { createdAt: "desc" }, 
        take: 5,
        include: { withdrawalRequest: true }
      },
      withdrawalRequests: { orderBy: { createdAt: "desc" }, take: 3 },
    },
  }) as UserWithRelations | null;

  if (!user) redirect("/login");

  const balance = user.balance;
  const minedBalance = user.minedBalance;

  // Calculate actual total accumulated earnings purely from ledger
  const rewardTransactions = await prisma.transaction.aggregate({
    where: { userId: session.user.id, type: "MINING_REWARD", status: "COMPLETED" },
    _sum: { amount: true }
  });
  const accumulatedEarnings = rewardTransactions._sum.amount || 0;

  // Calculate active staked balance
  const activeStakes = await prisma.stakingPlan.aggregate({
    where: { userId: session.user.id, status: "ACTIVE" },
    _sum: { amount: true }
  });
  const stakedBalance = activeStakes._sum.amount || 0;

  const topNfts = [
    { name: "Bored Ape", vol: "$3.2M", img: "/img2/main bored ape.jpg" },
    { name: "Crypto Kitties", vol: "$2.8M", img: "/img2/main crypto kitties.png" },
    { name: "Crypto Punks", vol: "$1.2M", img: "/img2/main crypto punks.jpg" },
  ];

  const topUsers = [
    { name: "Ismail", vol: "$52K", img: "/img2/user2.jpg" },
    { name: "Raja 001", vol: "$25K", img: "/img2/user1.jpg" },
    { name: "Lucas", vol: "$20K", img: "/img2/user3.jpg" },
  ];

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-8">
      {/* Welcome Banner */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <span className="text-3xl">👋</span>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Hello, {user.username}!</h1>
            <p className="text-gray-400 text-sm mt-0.5">Welcome back to your Aberra dashboard.</p>
          </div>
        </div>
      </div>

      {/* Account Overview Cards */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-4">Account Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#1c0417]/80 border border-purple-500/20 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src="/img2/totalicon.png" alt="" className="w-6 h-6 object-contain" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Balance</span>
              </div>
              <p className="text-3xl font-bold text-white">${balance.toFixed(2)}</p>
            </div>
            <div className="flex gap-2 mt-4">
              <Link href="/dashboard/deposit" className="flex-1 text-center py-2 rounded-lg bg-[#a855f7] text-white text-xs font-semibold hover:opacity-90 transition">Deposit</Link>
              <Link href="/withdrawal" className="flex-1 text-center py-2 rounded-lg bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition">Withdraw</Link>
            </div>
          </div>

          <div className="bg-[#1c0417]/80 border border-purple-500/20 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src="/img2/stakedicon.png" alt="" className="w-6 h-6 object-contain" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Staked</span>
              </div>
              <p className="text-3xl font-bold text-white">${stakedBalance.toFixed(2)}</p>
            </div>
            <Link href="/stake" className="block text-center mt-4 py-2 rounded-lg bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition">
              View Plans
            </Link>
          </div>

          <div className="bg-[#1c0417]/80 border border-purple-500/20 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src="/img2/stakedicon.png" alt="" className="w-6 h-6 object-contain" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mined</span>
              </div>
              <p className="text-3xl font-bold text-white">${minedBalance.toFixed(2)}</p>
            </div>
            <TransferMinedButton minedBalance={minedBalance} />
          </div>

          <div className="bg-[#1c0417]/80 border border-purple-500/20 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src="/img2/accumultedicon.png" alt="" className="w-6 h-6 object-contain" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Accumulated</span>
              </div>
              <p className="text-3xl font-bold text-white">${accumulatedEarnings.toFixed(2)}</p>
              <p className="text-gray-500 text-xs mt-4">
                {accumulatedEarnings > 0 ? "Total historical earnings" : "No accumulated earnings yet"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-4">Recent Transactions</h2>
        <div className="bg-[#1c0417]/80 border border-purple-500/20 rounded-2xl overflow-hidden">
          {user.transactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No transactions yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Type</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Amount</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Status</th>
                  <th className="text-left px-5 py-3 text-gray-400 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {user.transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="px-5 py-3 text-white font-medium">{tx.type}</td>
                    <td className="px-5 py-3 text-white">${tx.amount.toFixed(2)}</td>
                    <td className="px-5 py-3">
                      {(() => {
                        const displayStatus = tx.withdrawalRequest ? tx.withdrawalRequest.status : tx.status;
                        return (
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                            displayStatus === "COMPLETED" || displayStatus === "APPROVED" ? "bg-green-500/20 text-green-300" :
                            displayStatus === "PENDING" ? "bg-yellow-500/20 text-yellow-300" :
                            "bg-red-500/20 text-red-300"
                          }`}>
                            {displayStatus}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-5 py-3 text-gray-400">{new Date(tx.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Bottom 2-col: Top NFTs + Top Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top NFTs */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-4">Top NFTs</h2>
          <div className="bg-[#1c0417]/80 border border-purple-500/20 rounded-2xl divide-y divide-white/5">
            <div className="flex justify-between px-5 py-3 text-xs text-gray-500 font-semibold uppercase">
              <span>NFT</span><span>Traded Vol</span>
            </div>
            {topNfts.map((nft) => (
              <div key={nft.name} className="flex items-center justify-between px-5 py-3 hover:bg-white/5 transition">
                <div className="flex items-center gap-3">
                  <img src={nft.img} alt={nft.name} className="w-10 h-10 rounded-lg object-cover" />
                  <span className="text-white font-medium text-sm">{nft.name}</span>
                </div>
                <span className="text-[#facc15] font-bold text-sm">{nft.vol}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Top Users */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-4">Top Users</h2>
          <div className="bg-[#1c0417]/80 border border-purple-500/20 rounded-2xl divide-y divide-white/5">
            <div className="flex justify-between px-5 py-3 text-xs text-gray-500 font-semibold uppercase">
              <span>User</span><span>Mined Vol</span>
            </div>
            {topUsers.map((u) => (
              <div key={u.name} className="flex items-center justify-between px-5 py-3 hover:bg-white/5 transition">
                <div className="flex items-center gap-3">
                  <img src={u.img} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                  <span className="text-white font-medium text-sm">{u.name}</span>
                </div>
                <span className="text-[#facc15] font-bold text-sm">{u.vol}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
