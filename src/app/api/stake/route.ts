import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

const PLANS = {
  silver: { min: 100, days: 30 },
  gold: { min: 100, days: 60 },
  diamond: { min: 100, days: 90 },
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { plan, amount, crypto } = await req.json();

    if (!plan || !PLANS[plan as keyof typeof PLANS]) {
      return NextResponse.json({ message: "Invalid plan selected" }, { status: 400 });
    }
    if (!crypto) {
      return NextResponse.json({ message: "Please select a cryptocurrency" }, { status: 400 });
    }

    const parsedAmount = parseFloat(amount);
    const selectedPlan = PLANS[plan as keyof typeof PLANS];

    if (isNaN(parsedAmount) || parsedAmount < selectedPlan.min) {
      return NextResponse.json({ message: `Minimum amount for ${plan} is $${selectedPlan.min}` }, { status: 400 });
    }

    const userId = session.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    if (parsedAmount > user.balance) {
      return NextResponse.json({ message: `Amount exceeds available balance ($${user.balance.toFixed(2)})` }, { status: 400 });
    }

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + selectedPlan.days);

    const stakingPlan = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: parsedAmount } },
      });

      const sp = await tx.stakingPlan.create({
        data: {
          userId,
          planType: plan,
          amount: parsedAmount,
          endDate,
          status: "ACTIVE",
        },
      });

      await tx.transaction.create({
        data: {
          userId,
          type: "STAKE",
          amount: parsedAmount,
          status: "COMPLETED", // the stake creation is complete
        },
      });

      return sp;
    });

    return NextResponse.json({ message: "Mining plan activated successfully", plan: stakingPlan }, { status: 201 });
  } catch (error) {
    console.error("Stake API Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
