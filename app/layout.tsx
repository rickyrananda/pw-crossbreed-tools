import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PW Recipes',
  description: 'Pixel Worlds Recipe Explorer',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
