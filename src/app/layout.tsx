import type { Metadata } from 'next'
import { Geist } from 'next/font/google'

import '@/styles/globals.css'

import type { ReactNode } from 'react'

import { cn } from '@/utils/cv'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'The bug is on the table',
  description: 'Catch bugs on the table before they multiply',
  icons: {
    icon: [{ url: '/favicon.png', sizes: 'any' }],
  },
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={cn(geistSans.variable, 'antialiased')}>{children}</body>
    </html>
  )
}
