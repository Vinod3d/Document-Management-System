import { prisma } from "@/lib/prisma";
import { signIn } from "next-auth/react";

interface errorType {
  error: {
    message: string;
  };
}

export async function verifyOTP(email: string, code: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email:email } });
  
    if (!user) throw new Error("User not found");

    console.log(user)

    const otpRecord = await prisma.oTP.findUnique({ where: { userId: user.id } });
    if (!otpRecord || otpRecord.code !== code) throw new Error("Invalid OTP");

    if (otpRecord.expiresAt < new Date()) throw new Error("OTP expired");

    // await signIn("credentials", {
    //   email,
    //   otp : code,
    //   redirect: false
    // });

    await prisma.oTP.delete({ where: { userId: user.id } });

    return { success: true, message: "OTP verified successfully" };
  } catch (error) {
    const errorObj = error as errorType;
    const errorMessage = errorObj.error?.message || "Something went wrong";
    return { success: false, error: errorMessage };
  }
}