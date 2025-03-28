"use server";

// import CustomErrorHandler from "@/lib/CustomErrorHandler";
import { prisma } from "@/lib/prisma";

interface SuccessResponse {
  success: true;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface ErrorResponse {
  success: false;
  message: string;
  status?: number;
}

export async function registerUser(
  formData: FormData
): Promise<SuccessResponse | ErrorResponse> {
  try {
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const profilePhoto = formData.get("profilePhoto") as string | null;

    if (!username || !email) {
      return {
        success: false,
        message: "Username and email are required",
        status: 400
      };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return {
        success: false,
        message: "Email already in use",
        status: 409
      };
    }

    const newUser = await prisma.user.create({
      data: {
        name: username,
        email,
        image: profilePhoto,
      }
    });

    return {
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    };

  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Internal server error",
      status: 500
    };
  }
}