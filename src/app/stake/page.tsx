import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import DashboardNav from "@/components/DashboardNav";
import Link from "next/link";
import StakeForm from "@/components/StakeForm";

export default async function Stake() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { balance: true, username: true, isAdmin: true },
  });

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-[#3b0931]">
      <DashboardNav username={user.username} isAdmin={user.isAdmin} />
      <main className="pt-16">
        <div className="max-w-screen-2xl mx-auto px-4 py-4">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition text-sm mb-4">
            ← Back to Dashboard
          </Link>
        </div>
        <StakeForm initialBalance={user.balance} />
      </main>
    </div>
  );
}
