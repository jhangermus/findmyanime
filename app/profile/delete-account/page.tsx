"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export default function DeleteAccountPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [confirmation, setConfirmation] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsDeleting(true)
    setError(null)

    try {
      // In a real app, this would call an API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Log the user out
      logout()

      // Redirect to home page
      router.push("/")
    } catch (err) {
      setError("An error occurred. Please try again.")
      setIsDeleting(false)
    }
  }

  const isConfirmed = confirmation === "DELETE"

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-md">
        <Card className="bg-slate-900 border-slate-800 text-slate-200">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-center text-white">Delete Account</CardTitle>
            <CardDescription className="text-center text-slate-400">
              This action cannot be undone. All your data will be permanently deleted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4 bg-red-900/30 border-red-800 text-red-300">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="confirmation" className="text-slate-200">
                  To confirm, type "DELETE" in the field below
                </Label>
                <Input
                  id="confirmation"
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <Button
                type="submit"
                variant="destructive"
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={isDeleting || !isConfirmed}
              >
                {isDeleting ? "Deleting..." : "Permanently Delete Account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="ghost" className="text-slate-400" onClick={() => router.back()}>
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
