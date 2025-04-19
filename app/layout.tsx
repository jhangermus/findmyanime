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
  title: "FindMyAnime",
  description: "Discover your next favorite anime",
  icons: [
    { rel: 'icon', url: '/favicon.ico' },
    { rel: 'icon', url: '/favicon.svg', type: 'image/svg+xml' },
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
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
