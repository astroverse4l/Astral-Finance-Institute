import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Astral Finance Institute",
  description: "Learn about cryptocurrency, forex, and web3 technologies",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-700`}>
        <main>{children}</main>
      </body>
    </html>
  )
}
