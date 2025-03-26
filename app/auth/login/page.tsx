"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"

export default function LoginPage() {
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would call an API to send OTP
    toast.success( "OTP Sent", {
      description: `A verification code has been sent to ${phoneNumber}`,
      style: {
        backgroundColor: "#2da158",
        color: "white",
        border: "1px solid #065F46",
        fontWeight: "bold",
      },
    })
    setStep("otp")
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1)
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) {
        nextInput.focus()
      }
    }
  }

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would verify the OTP with an API
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
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            {step === "phone"
              ? "Enter your phone number to receive a verification code"
              : "Enter the verification code sent to your phone"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "phone" ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Send Verification Code
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
                Verify & Login
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {step === "otp" && (
            <Button variant="link" onClick={() => setStep("phone")}>
              Change phone number
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

