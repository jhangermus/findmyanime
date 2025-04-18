"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, ArrowRight, ArrowLeft } from "lucide-react"

interface TourStep {
  target: string
  title: string
  content: string
  position: "top" | "bottom" | "left" | "right"
}

export default function GuidedTour() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  const tourSteps: TourStep[] = [
    {
      target: "[data-tour='anime-daily']",
      title: "Anime of the Day",
      content: "Check out our featured anime recommendation updated daily.",
      position: "bottom",
    },
    {
      target: "[data-tour='filters']",
      title: "Filter Anime",
      content: "Use these filters to find anime that matches your preferences.",
      position: "right",
    },
    {
      target: "[data-tour='anime-grid']",
      title: "Browse Anime",
      content: "Explore our collection of anime and add them to your watchlist.",
      position: "top",
    },
    {
      target: "[data-tour='chat-button']",
      title: "AI Assistant",
      content: "Chat with our AI assistant to get personalized recommendations.",
      position: "left",
    },
  ]

  useEffect(() => {
    // Check if this is the first visit after login
    const hasSeenTour = localStorage.getItem("hasSeenTour")

    if (!hasSeenTour) {
      // Wait for the DOM to be fully loaded
      setTimeout(() => {
        setIsVisible(true)
        positionTooltip()
      }, 1000)
    }
  }, [])

  useEffect(() => {
    if (isVisible) {
      positionTooltip()
    }
  }, [currentStep, isVisible])

  const positionTooltip = () => {
    const step = tourSteps[currentStep]
    const targetElement = document.querySelector(step.target)

    if (targetElement) {
      const rect = targetElement.getBoundingClientRect()
      const tooltipWidth = 300
      const tooltipHeight = 150
      const margin = 20

      let top = 0
      let left = 0

      switch (step.position) {
        case "top":
          top = rect.top - tooltipHeight - margin
          left = rect.left + rect.width / 2 - tooltipWidth / 2
          break
        case "bottom":
          top = rect.bottom + margin
          left = rect.left + rect.width / 2 - tooltipWidth / 2
          break
        case "left":
          top = rect.top + rect.height / 2 - tooltipHeight / 2
          left = rect.left - tooltipWidth - margin
          break
        case "right":
          top = rect.top + rect.height / 2 - tooltipHeight / 2
          left = rect.right + margin
          break
      }

      // Adjust if tooltip goes off screen
      if (left < 0) left = margin
      if (left + tooltipWidth > window.innerWidth) left = window.innerWidth - tooltipWidth - margin
      if (top < 0) top = margin
      if (top + tooltipHeight > window.innerHeight) top = window.innerHeight - tooltipHeight - margin

      setPosition({ top, left })
    }
  }

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleClose()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem("hasSeenTour", "true")
  }

  if (!isVisible) return null

  return (
    <div className="fixed z-50 w-[300px]" style={{ top: `${position.top}px`, left: `${position.left}px` }}>
      <Card className="bg-slate-900 border-purple-500 shadow-lg shadow-purple-500/20">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-white">{tourSteps[currentStep].title}</h3>
            <Button variant="ghost" size="icon" onClick={handleClose} className="h-6 w-6 text-slate-400">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-slate-300 mb-4">{tourSteps[currentStep].content}</p>
          <div className="flex justify-between items-center">
            <div className="flex space-x-1">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 w-1.5 rounded-full ${index === currentStep ? "bg-purple-500" : "bg-slate-700"}`}
                />
              ))}
            </div>
            <div className="flex space-x-2">
              {currentStep > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevious}
                  className="h-8 text-slate-300 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              )}
              <Button size="sm" onClick={handleNext} className="h-8 bg-purple-600 hover:bg-purple-700">
                {currentStep < tourSteps.length - 1 ? (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  "Got it!"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
