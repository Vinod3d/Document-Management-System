"use server";

import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/utils/mailer";
// import { sendEmail } from "@/lib/mailer";
import { randomInt } from "crypto";

export async function sendOTP(email: string) {
  if (!email) throw new Error("Email is required");

  // Generate a 6-digit OTP
  const otpCode = randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) throw new Error("User not found");

  // Store OTP in DB
  await prisma.oTP.upsert({
    where: { userId: user.id },
    update: { code: otpCode, expiresAt },
    create: { userId: user.id, code: otpCode, expiresAt },
  });

  // Send OTP via email
  await sendEmail(
    email, 
    "Your OTP Code", 
    {
      text: `Your OTP is: ${otpCode}. Do not share this with anyone.`,
      html: {
        title: "Verify Your Account",
        body: "To complete your verification, please use the OTP below.",
        otp: otpCode,
        footer: "If you didn't request this, please ignore.",
      }
    }
  );
}
