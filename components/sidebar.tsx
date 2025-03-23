"use client"

import { useSidebar } from "./sidebar-provider"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { FileText, Home, Search, Upload, Users, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const routes = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/",
  },
  {
    label: "Upload Documents",
    icon: Upload,
    href: "/upload",
  },
  {
    label: "Search Documents",
    icon: Search,
    href: "/search",
  },
  {
    label: "Recent Documents",
    icon: FileText,
    href: "/recent",
  },
  {
    label: "Admin Panel",
    icon: Users,
    href: "/admin",
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { isOpen, close } = useSidebar()

  return (
    <>
      <div
        className={cn("fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden", isOpen ? "block" : "hidden")}
        onClick={close}
      />
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 border-r bg-background transition-transform lg:translate-x-0 lg:relative lg:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <h2 className="text-lg font-semibold">Document Management</h2>
          <Button variant="ghost" size="icon" onClick={close} className="lg:hidden">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="px-3 py-4">
            <nav className="flex flex-col gap-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={close}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    pathname === route.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  )}
                >
                  <route.icon className="h-5 w-5" />
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>
        </ScrollArea>
      </aside>
    </>
  )
}

