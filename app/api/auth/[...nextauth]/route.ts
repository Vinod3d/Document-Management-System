import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "OTP Login",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.otp) {
          throw new Error("Email and OTP are required");
        }

        const { email, otp } = credentials;

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email },
          include: { otp: true }, // Ensure `otp` is defined in your Prisma schema
        });

        if (!user) {
          throw new Error("No account found with this email");
        }

        // Verify OTP
        if (!user.otp || user.otp.code !== otp) {
          throw new Error("Invalid OTP");
        }

        if (new Date() > user.otp.expiresAt) {
          throw new Error("OTP has expired");
        }

        // Clean up OTP after successful verification
        await prisma.oTP.delete({
          where: { userId: user.id },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return { ...token, ...user }; // Store user data in token
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        image: token.image as string,
      };
      return session;
    }
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
