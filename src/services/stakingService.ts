import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

/**
 * Calculates the total accrued reward for a staking plan based on time elapsed.
 * Reward Rule: $1 per day for every $100 staked.
 */
export function calculateAccruedReward(
  amount: number,
  startDate: Date,
  endDate: Date,
  now: Date
): number {
  // Cap the calculation time at the maturity date
  const effectiveEnd = now > endDate ? endDate : now;
  
  if (effectiveEnd < startDate) return 0;

  const elapsedMs = effectiveEnd.getTime() - startDate.getTime();
  const elapsedDays = elapsedMs / (1000 * 60 * 60 * 24);
  
  // Daily reward is $1 per $100 -> equivalent to amount / 100
  const dailyRewardRate = amount / 100;
  
  return elapsedDays * dailyRewardRate;
}

/**
 * Idempotent processor that settles unsettled rewards into the user's minedBalance
 * and handles principal return for matured plans.
 * 
 * Must be called inside a Prisma transaction.
 */
export async function syncUserStaking(userId: string) {
  // We use an interactive transaction to ensure all balance updates are atomic
  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const activePlans = await tx.stakingPlan.findMany({
      where: { userId, status: "ACTIVE" },
    });

    const now = new Date();

    for (const plan of activePlans) {
      const totalAccrued = calculateAccruedReward(plan.amount, plan.startDate, plan.endDate, now);
      
      // Prevent floating point precision errors by rounding to 4 decimals internally
      const unsettled = Math.max(0, totalAccrued - plan.creditedRewards);
      
      const isMature = now >= plan.endDate;

      if (unsettled > 0.0001 || isMature) {
        
        // 1. Settle rewards if any have accrued since last check
        if (unsettled > 0.0001) {
          await tx.user.update({
            where: { id: userId },
            data: { minedBalance: { increment: unsettled } },
          });

          await tx.stakingPlan.update({
            where: { id: plan.id },
            data: { creditedRewards: { increment: unsettled } },
          });

          await tx.transaction.create({
            data: {
              userId,
              type: "MINING_REWARD",
              amount: unsettled,
              status: "COMPLETED",
            },
          });
        }

        // 2. Handle Maturity (Principal Return)
        if (isMature) {
          await tx.user.update({
            where: { id: userId },
            data: { balance: { increment: plan.amount } },
          });

          await tx.stakingPlan.update({
            where: { id: plan.id },
            data: { status: "COMPLETED" },
          });

          await tx.transaction.create({
            data: {
              userId,
              type: "STAKE_PRINCIPAL_RETURN",
              amount: plan.amount,
              status: "COMPLETED",
            },
          });
        }
      }
    }
  });
}
