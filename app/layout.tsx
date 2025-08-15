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
      <body className="font-sans">{children}</body>
    </html>
  )
}
