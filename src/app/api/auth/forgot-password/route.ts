import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ message: "Invalid email" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Return success anyway to prevent email enumeration
      return NextResponse.json({ message: "If an account exists, a reset link has been generated." }, { status: 200 });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = crypto.createHash("sha256").update(resetToken).digest("hex");
    
    // Set expiry to 1 hour from now
    const expiresAt = new Date(Date.now() + 3600000);

    // Save hash to DB (overwrite any existing token for this user)
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: hash,
        expiresAt,
      },
    });

    // In a real app, send an email here.
    // For this demonstration, we'll return the token in a special header or body 
    // only in development mode, but since we have no SMTP server, we will return it in the response 
    // so the user can actually test the flow. We wouldn't do this in production.
    const resetLink = `/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;

    return NextResponse.json({ 
      message: "If an account exists, a reset link has been generated.",
      _devOnlyResetLink: resetLink // Only provided since we lack an SMTP server in this environment
    }, { status: 200 });
  } catch (error) {
    console.error("Forgot Password error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
