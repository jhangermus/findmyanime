"use client"

import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { UserCircle } from "lucide-react"

export function MainNav() {
  const { user, signOut } = useAuth()

  return (
    <nav className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-end gap-4">
        {user ? (
          <>
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="gap-2">
                <UserCircle className="h-4 w-4" />
                Profile
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
            >
              Sign Out
            </Button>
          </>
        ) : (
          <Link href="/auth">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </nav>
  )
} 