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

    const { email, amount } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ message: "Invalid recipient email" }, { status: 400 });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ message: "Invalid transfer amount" }, { status: 400 });
    }

    const senderId = session.user.id;

    const sender = await prisma.user.findUnique({ where: { id: senderId } });
    if (!sender) {
      return NextResponse.json({ message: "Sender not found" }, { status: 404 });
    }

    if (sender.email.toLowerCase() === email.toLowerCase()) {
      return NextResponse.json({ message: "Cannot transfer to yourself" }, { status: 400 });
    }

    if (parsedAmount > sender.balance) {
      return NextResponse.json({ message: `Amount exceeds available balance ($${sender.balance.toFixed(2)})` }, { status: 400 });
    }

    const recipient = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!recipient) {
      return NextResponse.json({ message: "Recipient user not found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      // Deduct from sender
      await tx.user.update({
        where: { id: senderId },
        data: { balance: { decrement: parsedAmount } },
      });

      // Add to recipient
      await tx.user.update({
        where: { id: recipient.id },
        data: { balance: { increment: parsedAmount } },
      });

      // Create transaction record for sender
      await tx.transaction.create({
        data: {
          userId: senderId,
          type: "TRANSFER",
          amount: -parsedAmount, // Negative to denote outgoing
          status: "COMPLETED",
        },
      });

      // Create transaction record for recipient
      await tx.transaction.create({
        data: {
          userId: recipient.id,
          type: "TRANSFER",
          amount: parsedAmount, // Positive to denote incoming
          status: "COMPLETED",
        },
      });
    });

    return NextResponse.json({ message: "Transfer successful!" }, { status: 200 });
  } catch (error) {
    console.error("Transfer API Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
