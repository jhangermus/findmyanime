"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send, X } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import Link from "next/link"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your anime recommendation assistant. Tell me what kind of anime you're looking for and I'll help you find something perfect to watch.",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const { user, watchlist } = useAuth()

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          watchlist: watchlist,
          userId: user?.id,
        }),
      })

      const data = await response.json()
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error getting AI response:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again later.",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-purple-600 hover:bg-purple-700 z-10"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Open chat</span>
      </Button>

      {isOpen && (
        <div className="fixed top-0 right-0 h-full w-80 bg-slate-950 text-white shadow-lg z-20 flex flex-col transition-all duration-300 ease-in-out border-l border-slate-800">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Anime Helper</h3>
              <p className="text-xs text-gray-400">I'll help you find your ideal anime</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {user ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                    {message.sender === "ai" && (
                      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center mr-2 flex-shrink-0">
                        <span className="text-xs font-bold">AI</span>
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        message.sender === "user" ? "bg-purple-900" : "bg-slate-900"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center mr-2 flex-shrink-0">
                      <span className="text-xs font-bold">AI</span>
                    </div>
                    <div className="max-w-[80%] rounded-lg px-3 py-2 bg-slate-900">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-3 border-t border-slate-800">
                <div className="flex gap-2 items-center">
                  <div className="flex items-center gap-2 bg-slate-900 rounded-md px-2 py-1 flex-1">
                    <Input
                      placeholder="Type here..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSendMessage()
                        }
                      }}
                      className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-white"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSendMessage}
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-gray-400 hover:text-white hover:bg-transparent"
                      disabled={isLoading}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <p className="text-slate-400 mb-4">
                  Sign in to get personalized anime recommendations based on your watchlist and preferences
                </p>
                <Link href="/auth">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
