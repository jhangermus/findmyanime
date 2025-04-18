"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Filter, MessageCircle, Star, ListPlus } from "lucide-react"
import { setFirstLoginComplete } from "@/actions/auth-actions"

export default function WelcomePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "Welcome to AnimeFind!",
      description: "Your personal anime discovery platform. Let's take a quick tour of what you can do here.",
      icon: <Star className="h-12 w-12 text-purple-500" />,
    },
    {
      title: "Discover New Anime",
      description: "Browse our curated collection and use filters to find anime that matches your preferences.",
      icon: <Filter className="h-12 w-12 text-purple-500" />,
    },
    {
      title: "Build Your Watchlist",
      description: "Save anime to your watchlist to keep track of what you want to watch next.",
      icon: <ListPlus className="h-12 w-12 text-purple-500" />,
    },
    {
      title: "Get Personalized Recommendations",
      description: "Chat with our AI assistant to get personalized anime recommendations based on your preferences.",
      icon: <MessageCircle className="h-12 w-12 text-purple-500" />,
    },
  ]

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isLoading, isAuthenticated, router])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Mark first login as complete
      if (user?.id) {
        setFirstLoginComplete(user.id)
      }
      router.push("/")
    }
  }

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
            {steps[currentStep].title}
          </h1>
          <div className="flex justify-center mb-6">{steps[currentStep].icon}</div>
        </div>

        <Card className="bg-slate-900 border-slate-800 overflow-hidden">
          <CardContent className="p-6">
            <p className="text-slate-200 text-center mb-8">{steps[currentStep].description}</p>

            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full ${index === currentStep ? "bg-purple-500" : "bg-slate-700"}`}
                  />
                ))}
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleNext}>
                {currentStep < steps.length - 1 ? "Next" : "Get Started"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
