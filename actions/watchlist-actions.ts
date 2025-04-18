"use server"

import { revalidatePath } from "next/cache"
import { animeData } from "@/data/anime-data"

// In a real app, you would use a database
// This is a mock implementation for demonstration purposes
const WATCHLISTS_DB = new Map()

export async function addToWatchlist(userId: string, animeId: string) {
  // Simulate server delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const userWatchlist = WATCHLISTS_DB.get(userId) || []

  // Check if anime is already in watchlist
  if (!userWatchlist.includes(animeId)) {
    userWatchlist.push(animeId)
    WATCHLISTS_DB.set(userId, userWatchlist)
  }

  revalidatePath("/profile")
  return { success: true }
}

export async function removeFromWatchlist(userId: string, animeId: string) {
  // Simulate server delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  let userWatchlist = WATCHLISTS_DB.get(userId) || []

  // Remove anime from watchlist
  userWatchlist = userWatchlist.filter((id: string) => id !== animeId)
  WATCHLISTS_DB.set(userId, userWatchlist)

  revalidatePath("/profile")
  return { success: true }
}

export async function getUserWatchlist(userId: string) {
  // Simulate server delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const userWatchlistIds = WATCHLISTS_DB.get(userId) || []

  // Get anime details for each ID in the watchlist
  // In a real app, you would query a database
  const watchlist = userWatchlistIds.map((id: string) => animeData.find((anime) => anime.id === id)).filter(Boolean)

  return watchlist
}

export async function isInWatchlist(userId: string, animeId: string) {
  const userWatchlist = WATCHLISTS_DB.get(userId) || []
  return userWatchlist.includes(animeId)
}
