import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/auth-context"
import { LocalWatchlistProvider } from "@/context/local-watchlist-context"
import { MainHeader } from "@/components/main-header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Anime Recommendations",
  description: "Find your next favorite anime",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <LocalWatchlistProvider>
              <MainHeader />
              {children}
            </LocalWatchlistProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
