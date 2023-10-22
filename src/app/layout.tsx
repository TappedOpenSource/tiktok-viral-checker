import './globals.css'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react';
import { Rubik } from 'next/font/google'

const rubik = Rubik({ subsets: ['latin'] })

const title = 'Tapped.ai - Viral Checker'
const description = 'check if your song is viral on tiktok'
export const metadata: Metadata = {
  title,
  description,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      <meta
          name="description"
          content={description}
        />
        <meta property="og:site_name" content="tapped.ai" />
        <meta
          property="og:description"
          content={description}
        />
        <meta
          property="og:title"
          content={title}
        />
        <meta property="og:image" content="https://getmusicviralchecker.com/og.png"></meta>
        <meta property="og:url" content="https://tapped.ai"></meta>
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={title}
        />
        <meta
          name="twitter:description"
          content={description}
        />
        <meta property="twitter:image" content="https://getmusicviralchecker.com/og.png"></meta>
      </head>
      <body className={rubik.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
