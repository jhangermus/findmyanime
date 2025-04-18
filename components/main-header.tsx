"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { usePathname } from "next/navigation"

export function MainHeader() {
  const { user } = useAuth()
  const pathname = usePathname()

  return (
    <header className="bg-[#0B0F1A] border-b border-[#1E293B]">
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
        {pathname !== "/auth" && (
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
    </header>
  )
} 