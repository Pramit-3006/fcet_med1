import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Source_Sans_3 } from "next/font/google"
import "./globals.css"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
})

export const metadata: Metadata = {
  title: "MedAnalyze - AI-Powered Medical Image Analysis",
  description: "Advanced medical image analysis powered by artificial intelligence for healthcare professionals",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${sourceSans.variable}`}>
      <head>
        <style>{`
html {
  font-family: ${sourceSans.style.fontFamily};
  --font-heading: ${playfairDisplay.style.fontFamily};
  --font-body: ${sourceSans.style.fontFamily};
}
        `}</style>
      </head>
      <body className="font-sans">
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">{children}</main>
          <footer className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <img src="/starbitlabs-logo.png" alt="StarBitLabs" className="h-8 w-auto" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium">Powered by StarBitLabs</p>
                    <p>Advanced AI Solutions for Healthcare</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground text-center sm:text-right">
                  <p>© 2024 StarBitLabs. All rights reserved.</p>
                  <p>Medical AI Technology Solutions</p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
