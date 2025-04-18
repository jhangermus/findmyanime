"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function FilterSection() {
  const [episodeRange, setEpisodeRange] = useState([1, 100])

  const genres = [
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Fantasy",
    "Horror",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Slice of Life",
    "Sports",
    "Supernatural",
    "Thriller",
  ]

  const studios = [
    "Toei Animation",
    "Madhouse",
    "Kyoto Animation",
    "Bones",
    "Wit Studio",
    "MAPPA",
    "A-1 Pictures",
    "Production I.G",
    "Sunrise",
    "Ufotable",
  ]

  const years = [
    "2023",
    "2022",
    "2021",
    "2020",
    "2019",
    "2018",
    "2017",
    "2016",
    "2015",
    "2010-2014",
    "2000-2009",
    "1990-1999",
    "Before 1990",
  ]

  return (
    <div className="bg-slate-900 rounded-xl p-4 shadow-md sticky top-4 border border-slate-800">
      <h2 className="text-xl font-bold mb-4 text-white">Filter Anime</h2>

      <Accordion type="multiple" defaultValue={["genres", "episodes"]} className="text-slate-200">
        <AccordionItem value="genres" className="border-slate-800">
          <AccordionTrigger className="hover:text-slate-100">Genres</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              {genres.map((genre) => (
                <div key={genre} className="flex items-center space-x-2">
                  <Checkbox
                    id={`genre-${genre}`}
                    className="border-slate-700 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                  <Label htmlFor={`genre-${genre}`} className="text-sm cursor-pointer text-slate-300">
                    {genre}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="episodes" className="border-slate-800">
          <AccordionTrigger className="hover:text-slate-100">Episodes</AccordionTrigger>
          <AccordionContent>
            <div className="px-2 py-4">
              <Slider
                defaultValue={[1, 100]}
                max={100}
                step={1}
                minStepsBetweenThumbs={1}
                onValueChange={(value) => setEpisodeRange(value)}
                className="[&_[role=slider]]:bg-purple-600"
              />
              <div className="flex justify-between mt-2 text-sm text-slate-400">
                <span>{episodeRange[0]} eps</span>
                <span>{episodeRange[1] === 100 ? "100+ eps" : `${episodeRange[1]} eps`}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="studios" className="border-slate-800">
          <AccordionTrigger className="hover:text-slate-100">Studios</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              {studios.map((studio) => (
                <div key={studio} className="flex items-center space-x-2">
                  <Checkbox
                    id={`studio-${studio}`}
                    className="border-slate-700 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                  <Label htmlFor={`studio-${studio}`} className="text-sm cursor-pointer text-slate-300">
                    {studio}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="years" className="border-slate-800">
          <AccordionTrigger className="hover:text-slate-100">Years</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              {years.map((year) => (
                <div key={year} className="flex items-center space-x-2">
                  <Checkbox
                    id={`year-${year}`}
                    className="border-slate-700 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                  <Label htmlFor={`year-${year}`} className="text-sm cursor-pointer text-slate-300">
                    {year}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-6 space-y-2">
        <Button className="w-full bg-purple-600 hover:bg-purple-700">Apply Filters</Button>
        <Button className="w-full bg-purple-600 hover:bg-purple-700">Reset</Button>
      </div>
    </div>
  )
}
