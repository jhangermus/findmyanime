"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { UserCircle } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()
  const { user } = useAuth()

  // Don't show navbar on auth page or welcome page
  if (pathname === "/auth" || pathname === "/welcome") {
    return null
  }

  return (
    <header className="bg-[#0B0F1A]">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-medium text-purple-500">
            FindMyAnime
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white hover:text-white/80">
              Home
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="text-slate-200 hover:bg-slate-800">
                <UserCircle className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/auth">
                <Button size="sm" className="bg-[#1E293B] text-white hover:bg-[#334155]">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="sm" className="bg-[#1E293B] text-white hover:bg-[#334155]">
                  Log In
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
