import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import localFont from 'next/font/local'

import Footer from '@/components/footer'
import Header from '@/components/header'
import Providers from '@/components/providers'

import { esES } from '@clerk/localizations'
import { ClerkProvider } from '@clerk/nextjs'

import { Toaster } from '@/components/ui/toaster'
import Script from 'next/script'
import './globals.css'
import { WhatsAppButton } from '@/components/WhatsAppButton'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900'
})
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif'
})

export const metadata: Metadata = {
  title: 'Tinta Academy',
  description: 'Centro de formación especializado en la educación sobre vinos donde vas a descubrir, enriquecer y elevar tu conocimiento sobre la cultura del vino con una perspectiva global.',
  openGraph: {
    title: 'Tinta Academy',
    description: 'Centro de formación especializado en la educación sobre vinos donde vas a descubrir, enriquecer y elevar tu conocimiento sobre la cultura del vino con una perspectiva global.',
    images: ['/og.jpg'],
  },
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider localization={esES}>
      <html lang="es" className='scroll-smooth' suppressHydrationWarning>
        <body
          className={cn(
            'flex min-h-screen flex-col antialiased',
            geistSans.variable,
            geistMono.variable,
            inter.variable,
            playfair.variable,
          )}

        >
          <Providers>
            <Header />
            <main className='flex flex-col flex-1 mt-20 border-t border-b'>
              {children}
            </main>
            <WhatsAppButton />
            <Footer />
            <Toaster />
          </Providers>


        </body>
      </html>
    </ClerkProvider>
  )
}