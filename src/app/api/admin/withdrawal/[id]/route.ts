import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Map withdrawal status to corresponding Transaction status
const STATUS_MAP: Record<string, string> = {
  APPROVED: "PENDING",     // Approved but not yet sent — still pending processing
  COMPLETED: "COMPLETED",  // Funds have been sent — mark transaction as done
  REJECTED: "FAILED",      // Rejected — mark transaction as failed
};

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Only admins can change withdrawal status
    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true },
    });
    if (!adminUser?.isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { status } = await req.json();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const validStatuses = ["APPROVED", "COMPLETED", "REJECTED"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` }, { status: 400 });
    }

    const withdrawal = await prisma.withdrawalRequest.findUnique({
      where: { id },
      include: { transactions: true },
    });

    if (!withdrawal) {
      return NextResponse.json({ message: "Withdrawal request not found" }, { status: 404 });
    }

    if (withdrawal.status === status) {
      return NextResponse.json({ message: "Status is already set to " + status }, { status: 400 });
    }

    const transactionStatus = STATUS_MAP[status];

    // Update both records atomically — this is the single source of truth update
    await prisma.$transaction(async (tx) => {
      // 1. Update the WithdrawalRequest status
      await tx.withdrawalRequest.update({
        where: { id },
        data: { status },
      });

      // 2. Update ALL linked Transaction records to match
      if (withdrawal.transactions.length > 0) {
        await tx.transaction.updateMany({
          where: { withdrawalRequestId: id },
          data: { status: transactionStatus },
        });
      }

      // 3. If the withdrawal is REJECTED, refund the user's balance
      if (status === "REJECTED") {
        await tx.user.update({
          where: { id: withdrawal.userId },
          data: { balance: { increment: withdrawal.amount } },
        });
      }
    });

    return NextResponse.json({
      message: `Withdrawal ${status.toLowerCase()} successfully`,
      withdrawalId: id,
      newStatus: status,
      transactionStatus,
    });

  } catch (error) {
    console.error("Admin withdrawal update error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
