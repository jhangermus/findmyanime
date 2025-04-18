"use client"

import { useAuth } from "@/context/auth-context"
import AnimeDaily from "@/components/anime-daily"
import AnimeGrid from "@/components/anime-grid"
import FilterSection from "@/components/filter-section"
import ChatButton from "@/components/chat-button"
import GuidedTour from "@/components/guided-tour"
import { MainNav } from "@/components/main-nav"
import { animeData } from "@/data/anime-data"

export default function Home() {
  const { user } = useAuth()

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200">
      <MainNav />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            FindMyAnime
          </h1>
          <p className="text-center text-slate-400 mt-2">
            {user ? 
              `Welcome back, ${user.username}! Discover your next favorite anime` : 
              "Discover your next favorite anime based on your preferences"}
          </p>
          {!user && (
            <div className="mt-4 text-center">
              <a 
                href="/auth" 
                className="text-sm text-purple-400 hover:text-purple-300"
              >
                Sign in to save your favorites and get personalized recommendations →
              </a>
            </div>
          )}
        </header>

        <div data-tour="anime-daily">
          <AnimeDaily />
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1" data-tour="filters">
            <FilterSection />
          </div>
          <div className="lg:col-span-3" data-tour="anime-grid">
            <AnimeGrid initialAnimeList={animeData} />
          </div>
        </div>

        <div data-tour="chat-button">
          <ChatButton />
        </div>

        <GuidedTour />
      </div>
    </main>
  )
}
