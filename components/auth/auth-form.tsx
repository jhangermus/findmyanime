"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Home } from "lucide-react"

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (isLogin) {
        await signIn(email, password)
        router.push("/")
      } else {
        console.log("Iniciando registro con:", { email, password, username })
        try {
          await signUp(email, password, username)
          console.log("Registro exitoso")
          router.push("/")
        } catch (signUpError) {
          console.error("Error detallado del registro:", signUpError)
          if (signUpError instanceof Error) {
            if (signUpError.message.includes('Este email esta siendo usado')) {
              setError("Este email ya está registrado. Por favor, usa otro email o inicia sesión.")
            } else {
              setError(signUpError.message)
            }
          } else {
            setError("Error durante el registro: " + JSON.stringify(signUpError))
          }
        }
      }
    } catch (err) {
      console.error("Error durante la autenticación:", err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Error inesperado: " + JSON.stringify(err))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative w-full max-w-md">
      <Button
        variant="ghost"
        size="icon"
        className="absolute -top-12 left-0"
        onClick={() => router.push("/")}
        aria-label="Go to home"
      >
        <Home className="h-6 w-6" />
      </Button>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{isLogin ? "Sign In" : "Create Account"}</CardTitle>
          <CardDescription>
            {isLogin
              ? "Sign in to access your watchlist and get personalized recommendations"
              : "Create an account to start building your anime watchlist"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
                  disabled={isLoading}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password (min. 6 characters)"
                minLength={6}
                disabled={isLoading}
              />
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500 rounded-md p-3">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setIsLogin(!isLogin)
                setError(null)
              }}
              disabled={isLoading}
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 