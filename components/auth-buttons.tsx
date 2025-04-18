"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { UserCircle } from "lucide-react"
import { usePathname } from "next/navigation"

export function AuthButtons() {
  const { user } = useAuth()
  const pathname = usePathname()

  // Don't show auth buttons on auth page
  if (pathname === "/auth") {
    return null
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-end py-4">
        {user ? (
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="text-slate-200 hover:bg-slate-800">
              <UserCircle className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Button>
          </Link>
        ) : (
          <div className="flex items-center gap-4">
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
          </div>
        )}
      </div>
    </div>
  )
} 