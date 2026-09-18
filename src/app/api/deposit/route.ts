import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { amount, crypto, network, txHash } = await req.json();

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
    }

    if (!crypto || !network || !txHash) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const trimmedTxHash = txHash.trim();
    if (!trimmedTxHash) {
      return NextResponse.json({ message: "Transaction hash cannot be empty" }, { status: 400 });
    }

    // Validate crypto/network combination
    const validCombinations: Record<string, string[]> = {
      BTC: ["BTC"],
      ETH: ["ERC20"],
      BNB: ["BEP20"],
      USDT: ["ERC20", "TRC20"],
      SOL: ["Solana"],
    };

    if (!validCombinations[crypto] || !validCombinations[crypto].includes(network)) {
      return NextResponse.json({ message: "Invalid cryptocurrency or network" }, { status: 400 });
    }

    // Check for duplicate transaction hash
    const existingTx = await prisma.depositRequest.findUnique({
      where: { txHash: trimmedTxHash },
    });

    if (existingTx) {
      return NextResponse.json({ message: "This transaction hash has already been submitted" }, { status: 400 });
    }

    // Create Deposit Request
    const depositReq = await prisma.$transaction(async (tx) => {
      const deposit = await tx.depositRequest.create({
        data: {
          userId: session.user.id,
          amount: parseFloat(amount),
          crypto,
          network,
          txHash: trimmedTxHash,
          status: "PENDING",
        },
      });

      // Also create a Transaction record linked to this deposit request
      await tx.transaction.create({
        data: {
          userId: session.user.id,
          type: "DEPOSIT",
          amount: parseFloat(amount),
          status: "PENDING",
          depositRequestId: deposit.id,
        },
      });

      return deposit;
    });

    return NextResponse.json({ message: "Deposit request submitted successfully. It will be credited once verified.", deposit: depositReq }, { status: 201 });
  } catch (error) {
    console.error("Deposit API Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
