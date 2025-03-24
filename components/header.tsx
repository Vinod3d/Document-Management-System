"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "./sidebar-provider";
import { Menu, Moon, Sun } from "lucide-react";
// import { useTheme } from "next-themes"
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, Home, Search, Upload, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const routes = [
  {
    label: "Home",
    icon: Home,
    href: "/",
  },
  {
    label: "Upload",
    icon: Upload,
    href: "/upload",
  },
  {
    label: "Search",
    icon: Search,
    href: "/search",
  },
  {
    label: "Recent",
    icon: FileText,
    href: "/recent",
  },
  {
    label: "Admin",
    icon: Users,
    href: "/admin",
  },
];

export default function Header() {
  const pathname = usePathname();
  const { toggle } = useSidebar();
  //   const { setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-30 flex justify-between h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        className="lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div className="logo hidden lg:block">
        <Link href={"/"}>
          <h2 className="text-xl font-bold">
            <span className="text-red-400">Document</span> Management
          </h2>
        </Link>
      </div>
      <nav className="hidden gap-1  lg:flex">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            onClick={close}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === route.href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            {/* <route.icon className="h-5 w-5" /> */}
            {route.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Light</DropdownMenuItem>
            <DropdownMenuItem>Dark</DropdownMenuItem>
            <DropdownMenuItem>System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="/placeholder.svg?height=32&width=32"
                  alt="User"
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/auth/login">Logout</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
