import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a string to match Crunchyroll's URL format
 */
export function formatForCrunchyroll(title: string): string {
  // Convert to lowercase and replace spaces with hyphens
  let formatted = title.toLowerCase().replace(/\s+/g, '-')
  
  // Remove special characters except hyphens
  formatted = formatted.replace(/[^a-z0-9-]/g, '')
  
  // Replace multiple hyphens with a single hyphen
  formatted = formatted.replace(/-+/g, '-')
  
  // Remove hyphens from start and end
  formatted = formatted.replace(/^-+|-+$/g, '')

  return formatted
}

/**
 * Generates a Crunchyroll URL for an anime
 * Returns a direct URL if possible, falls back to search URL
 */
export function getCrunchyrollUrl(title: string): string {
  // If title is too long or contains special characters, use search URL
  if (title.length > 50 || /[^\w\s-]/.test(title)) {
    const formattedTitle = encodeURIComponent(title)
    return `https://www.crunchyroll.com/search?q=${formattedTitle}`
  }

  // Try to generate a direct URL
  const formattedTitle = formatForCrunchyroll(title)
  return `https://www.crunchyroll.com/series/${formattedTitle}`
}
