import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error("User not found");

      const amountToTransfer = user.minedBalance;

      if (amountToTransfer <= 0) {
        throw new Error("No mined balance to transfer");
      }

      // Transfer from minedBalance to Total Balance
      await tx.user.update({
        where: { id: userId },
        data: {
          minedBalance: 0, // Reset mined balance
          balance: { increment: amountToTransfer }, // Add to total balance
        },
      });

      // Record the transfer transaction
      await tx.transaction.create({
        data: {
          userId,
          type: "TRANSFER",
          amount: amountToTransfer,
          status: "COMPLETED",
        },
      });

      return amountToTransfer;
    });

    return NextResponse.json({ 
      message: `Successfully transferred $${result.toFixed(2)} to your Total Balance`,
      transferredAmount: result
    }, { status: 200 });

  } catch (error: any) {
    console.error("Transfer Mined API Error:", error);
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
  }
}
