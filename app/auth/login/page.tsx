"use client"

import type React from "react"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { sendOTP } from "@/actions/sendOTP"
import { verifyOTP } from "@/actions/verifyOTP"

interface errorType {
  error: {
    message: string;
  };
}

export default function LoginPage() {
  const [step, setStep] = useState<"email" | "otp">("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isPending, startTransition] = useTransition();
  const router = useRouter()

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await sendOTP(email);
        toast.success("OTP Sent", {
          description: `A verification code has been sent to ${email}.`,
          style: {
            backgroundColor: "#2da158",
            color: "white",
            border: "1px solid #065F46",
            fontWeight: "bold",
          },
        });
        setStep("otp");
      } catch (error) {
        const errorObj = error as errorType;
        const errorMessage = errorObj.error?.message || "Something went wrong";
        toast.error(`Error sending OTP: ${errorMessage}`);
      }
    });
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1)
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) {
        nextInput.focus()
      }
    }
  }

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async()=>{
      try {
        await verifyOTP(email, otp.join(''))
        toast.success( "Login Successful", {
          description: "You have been logged in successfully",
          style: {
            backgroundColor: "#2da158",
            color: "white",
            border: "1px solid #065F46",
            fontWeight: "bold",
          },
        })
        router.push("/")
      } catch (error) {
        const errorObj = error as errorType;
        const errorMessage = errorObj.error?.message || "Something went wrong";
        toast.error(`Error Verifying OTP,${errorMessage} `);
      }
    })
   
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            {step === "email"
              ? "Enter your Email to receive a verification code"
              : "Enter the verification code sent to your Email"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "email" ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {isPending ? "Sending..." : "Send Verification Code"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp-0">Verification Code</Label>
                <div className="flex gap-2 justify-between">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      className="w-12 h-12 text-center text-lg"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      maxLength={1}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      required
                    />
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full">
                {isPending ? "Verifying..." : "Verify & Login"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {step === "otp" && (
            <Button variant="link" onClick={() => setStep("email")}>
              Change Your Email Id
            </Button>
          )}
          <div className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

