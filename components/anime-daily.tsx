import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StarIcon } from "lucide-react"
import { AddToWatchlistButton } from "@/components/add-to-watchlist-button"

export default function AnimeDaily() {
  // This would typically come from an API or database
  const dailyAnime = {
    id: "1",
    title: "Attack on Titan",
    description:
      "In a world where humanity lives within cities surrounded by enormous walls that protect them from gigantic man-eating humanoids referred to as Titans, the story follows Eren Yeager, who vows to retake the world after a Titan brings about the destruction of his hometown and the death of his mother.",
    image: "/placeholder.svg?height=600&width=400",
    genres: ["Action", "Drama", "Fantasy"],
    episodes: 75,
    rating: 9.0,
    studio: "Wit Studio / MAPPA",
    year: 2013,
  }

  return (
    <section className="rounded-xl overflow-hidden bg-slate-900 shadow-lg border border-slate-800">
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-purple-600 hover:bg-purple-700">Anime Daily</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative h-[400px] md:h-auto">
            <Image src={dailyAnime.image || "/placeholder.svg"} alt={dailyAnime.title} fill className="object-cover" />
          </div>
          <div className="p-6 md:col-span-2 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-white">{dailyAnime.title}</h2>
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(dailyAnime.rating / 2) ? "text-yellow-500 fill-yellow-500" : "text-gray-600"}`}
                    />
                  ))}
                  <span className="ml-2 text-slate-400">{dailyAnime.rating}/10</span>
                </div>
                <div className="text-slate-400">{dailyAnime.episodes} episodes</div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {dailyAnime.genres.map((genre) => (
                  <Badge key={genre} variant="outline" className="border-slate-700 text-slate-300">
                    {genre}
                  </Badge>
                ))}
              </div>
              <p className="text-slate-300 mb-4 line-clamp-4 md:line-clamp-none">{dailyAnime.description}</p>
              <div className="text-sm text-slate-400 mb-6">
                <p>Studio: {dailyAnime.studio}</p>
                <p>Year: {dailyAnime.year}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button className="bg-purple-600 hover:bg-purple-700">Watch Now</Button>
              <AddToWatchlistButton animeId={dailyAnime.id} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
