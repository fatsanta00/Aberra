import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

const VALID_CRYPTOS = ["BTC", "ETH", "USDT", "BSC"];

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { crypto, walletAddress, amount } = body;

    if (!crypto || !VALID_CRYPTOS.includes(crypto)) {
      return NextResponse.json({ message: "Invalid cryptocurrency selection" }, { status: 400 });
    }
    if (!walletAddress || typeof walletAddress !== "string" || walletAddress.trim().length === 0) {
      return NextResponse.json({ message: "Invalid wallet address" }, { status: 400 });
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
    }
    if (parsedAmount < 750) {
      return NextResponse.json({ message: "Minimum withdrawal amount is $750" }, { status: 400 });
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (parsedAmount > user.balance) {
      return NextResponse.json({
        message: `Requested amount ($${parsedAmount.toFixed(2)}) exceeds available balance ($${user.balance.toFixed(2)})`
      }, { status: 400 });
    }

    // Atomic: deduct balance, create WithdrawalRequest, then create the linked Transaction
    const withdrawalRequest = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: parsedAmount } },
      });

      // Create the WithdrawalRequest first to get its ID
      const wr = await tx.withdrawalRequest.create({
        data: {
          userId,
          crypto,
          walletAddress: walletAddress.trim(),
          amount: parsedAmount,
          status: "PENDING",
        },
      });

      // Create the Transaction and link it to the WithdrawalRequest via withdrawalRequestId
      // This is the single source of truth link — status changes to the WithdrawalRequest
      // are propagated to this Transaction via the admin action API.
      await tx.transaction.create({
        data: {
          userId,
          type: "WITHDRAWAL",
          amount: parsedAmount,
          status: "PENDING",
          withdrawalRequestId: wr.id, // <-- The critical link
        },
      });

      return wr;
    });

    return NextResponse.json({
      message: "Withdrawal request submitted successfully",
      withdrawal: {
        id: withdrawalRequest.id,
        crypto: withdrawalRequest.crypto,
        amount: withdrawalRequest.amount,
        status: withdrawalRequest.status,
        createdAt: withdrawalRequest.createdAt,
      },
    }, { status: 201 });

  } catch (error) {
    console.error("Withdrawal API error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
