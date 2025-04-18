"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function RegistrationSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push("/")
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800 text-slate-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Registration Successful!</CardTitle>
          <CardDescription className="text-slate-400">
            Your account has been created and you are now logged in.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-slate-300">
            You can now start exploring anime and building your watchlist. You'll be redirected to the home page in a
            few seconds.
          </p>
          <div className="flex justify-center">
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => router.push("/")}>
              Go to Home Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
