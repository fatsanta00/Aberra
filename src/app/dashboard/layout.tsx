import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardNav from "@/components/DashboardNav";
import prisma from "@/lib/prisma";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { username: true, isAdmin: true },
  });

  return (
    <div className="min-h-screen bg-[#3b0931]">
      <DashboardNav username={user?.username ?? session.user.name ?? ""} isAdmin={user?.isAdmin ?? false} />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}
