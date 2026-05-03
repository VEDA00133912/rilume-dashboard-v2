import type { Metadata } from 'next'
import { Geist_Mono, Space_Grotesk } from 'next/font/google'
import './globals.css'
import SessionProvider from '@/components/SessionProvider'

const sans = Space_Grotesk({ subsets: ['latin'], variable: '--font-sans' })
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'Rilume Dashboard',
  description: 'Rilume Developer Dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="dark">
      <body className={`${sans.variable} ${mono.variable} bg-[#0a0b0d] text-white antialiased`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}