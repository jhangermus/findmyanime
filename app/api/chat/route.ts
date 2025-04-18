import { NextResponse } from "next/server"
import type { WatchlistItem } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { message, watchlist, userId } = await request.json()

    // Aquí iría la integración con DeepSeek
    // Por ahora, usaremos una respuesta simulada
    const response = await generateAIResponse(message, watchlist)

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    )
  }
}

async function generateAIResponse(message: string, watchlist: WatchlistItem[]) {
  // Esta función sería reemplazada por la integración real con DeepSeek
  const userWatchlist = watchlist.map((item) => item.anime_id).join(", ")

  const prompt = `You are an anime recommendation assistant. The user has the following anime in their watchlist: ${userWatchlist}.
  Based on their watchlist and their message: "${message}", provide personalized recommendations.
  Consider their preferences and suggest similar anime they might enjoy.
  Be specific about why you're recommending each anime and how it relates to their interests.`

  // Aquí iría la llamada real a DeepSeek
  // Por ahora, usaremos una respuesta simulada
  return `Based on your watchlist and preferences, I recommend:

1. "Attack on Titan" - Since you enjoy action-packed series with deep storylines
2. "Demon Slayer" - Similar to your interest in beautifully animated action series
3. "Spy x Family" - A great mix of action and comedy that matches your taste

These recommendations are based on your current watchlist and the patterns I've noticed in your preferences. Would you like more specific recommendations based on any particular genre or theme?`
} 