"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { CheckCircle, UserRound, X, XCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { registerUser } from "@/actions/authActions";
import { UploadButton } from "@/utils/uploadthing";
import axios from "axios";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageDeleting, setImageDeleting] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    // Username validation
    if (username.length < 3) {
      toast("Invalid username", {
        description: "Username must be at least 3 characters long",
        icon: <XCircle className="text-white" />,
        style: {
          backgroundColor: "#B91C1C",
          color: "white",
          border: "1px solid #991B1B",
          fontWeight: "bold",
        },
      });
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast("Invalid email", {
        description: "Please enter a valid email address",
        icon: <XCircle className="text-white" />,
        style: {
          backgroundColor: "#B91C1C",
          color: "white",
          border: "1px solid #991B1B",
          fontWeight: "bold",
        },
      });
      return false;
    }

    return true;
  };

  // Handle profile image upload
  const handleUploadComplete = (uploadedFiles: { url: string }[]) => {
    if (uploadedFiles.length > 0) {
      setProfilePhoto(uploadedFiles[0].url);
      toast.success("Profile photo uploaded successfully!", {
        icon: <CheckCircle className="text-white" />,
        style: {
          backgroundColor: "#2ECC40",
          color: "white",
          border: "1px solid #2ECC40",
          fontWeight: "bold",
        }
      });
    }
  };

  const handleUploadError = (error: Error) => {
    toast.error("Upload failed", {
      description: error.message,
      icon: <XCircle className="text-white" />,
      style: {
        backgroundColor: "#B91C1C",
        color: "white",
        border: "1px solid #991B1B",
        fontWeight: "bold",
      },
    });
  };

  const handleRemoveImage = (image: string)=>{
    setImageDeleting(true);
    const imageKey = image.substring(image.lastIndexOf("/") + 1);
    axios
      .post("/api/uploadthing/delete", { imageKey })
      .then((res) => {
        if (res.data.success) {
          setProfilePhoto("");
          toast.success("Image Deleted successfully", {
            style: {
              background: "#4CAF50",
              color: "white",
            },
          });
        }
      })
      .catch((error) => {
        toast.error(`Upload failed! ${error.message}`, {
          style: {
            background: "#FF4C4C",
            color: "white",
          },
        });
      })
      .finally(() => {
        setImageDeleting(false);
      });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      if (profilePhoto) {
        formData.append("profilePhoto", profilePhoto);
      }

      const result = await registerUser(formData);
 
      if (result.success){

        toast.success("Registration Successful!", {
          description: `Welcome ! Redirecting to login...`,
          icon: <CheckCircle className="text-white" />,
          style: {
            backgroundColor: "#059669",
            color: "white",
            border: "1px solid #047857",
            fontWeight: "bold",
          },
        });
        router.push("/auth/login");
      
      } else {
        throw new Error("Unexpected response from server");
      }

    } catch (error) {
      console.error(error);
      toast("Registration failed", {
        description: "An error occurred during registration. Please try again.",
        icon: <XCircle className="text-white" />,
        style: {
          backgroundColor: "#B91C1C",
          color: "white",
          border: "1px solid #991B1B",
          fontWeight: "bold",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md relative overflow-hidden">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Create an account
          </CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              variant="outline"
              className="flex-1"
              disabled={isSubmitting}
            >
              <svg
                className="w-4 h-4 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.784-1.664-4.167-2.675-6.735-2.675-5.522 0-10 4.477-10 10s4.478 10 10 10c8.396 0 10-7.496 10-10 0-0.67-0.068-1.325-0.182-1.955h-9.818z" />
              </svg>
              Google
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              disabled={isSubmitting}
            >
              <svg
                className="w-4 h-4 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </Button>
          </div>
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profilePhoto">Profile Photo</Label>
              <div className="flex flex-col items-center gap-4">
                {profilePhoto ? (
                  <div className="relative h-24 w-24">
                    <Image
                      src={profilePhoto || "/placeholder.svg"}
                      alt="Profile preview"
                      fill
                      className="rounded-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                      onClick={()=>handleRemoveImage(profilePhoto)}
                      disabled={imageDeleting}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                    <UserRound className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}

                <div className="flex w-full items-center gap-2">
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={handleUploadComplete}
                    onUploadError={handleUploadError}
                    appearance={{
                      button: ({ ready, isUploading }) => `
                        w-full 
                        ${ready ? "bg-gradient-to-r from-blue-500 to-purple-600" : "bg-gray-300"} 
                        ${isUploading ? "animate-pulse" : ""}
                        text-white 
                        font-medium 
                        py-[6px] px-6 
                        rounded-lg 
                        shadow-md 
                        hover:shadow-lg 
                        transition-all 
                        duration-200 
                        focus:outline-none 
                        focus:ring-2 
                        focus:ring-blue-400 
                        focus:ring-opacity-75
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                      `,
                      container: "w-full",
                      allowedContent: "text-xs text-gray-500 mt-1 hidden",
                    }}
                    content={{
                      button({ ready, isUploading }) {
                        if (isUploading) return "Uploading...";
                        return ready ? "Upload Images" : "Preparing...";
                      },
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      allowedContent({ ready, fileTypes }) {
                        return ready
                          ? "PNG, JPG, GIF up to 4MB"
                          : "Checking setup...";
                      },
                    }}
                  />

                  {profilePhoto && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={()=>handleRemoveImage(profilePhoto)}
                      disabled={imageDeleting}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
