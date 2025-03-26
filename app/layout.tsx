import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/sidebar-provider";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/sessionProvider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Document Management System",
  description: "A comprehensive document management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        cz-shortcut-listen="true"
      >
        <Providers>
          <Toaster/>
          <main className="flex flex-col min-h-screen bg-secondary">
            <SidebarProvider>
              <div className="flex min-h-screen">
                <Sidebar/>
                <div className="flex-1 flex flex-col">
                  <Header/>
                  <div className="flex-1 p-4 md:p-6">{children}</div>
                </div>
              </div>
            </SidebarProvider>
          </main>
        </Providers>
      </body>
    </html>
  );
}
