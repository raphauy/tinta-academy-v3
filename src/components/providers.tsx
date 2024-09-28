'use client'

import { ThemeProvider } from 'next-themes'
import { Toaster } from './ui/toaster'
import { TailwindIndicator } from './tailwind-indicator'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      enableSystem
      attribute='class'
      defaultTheme='light'
      disableTransitionOnChange
    >
      {children}
      {/* <Toaster /> */}
      <TailwindIndicator />
      </ThemeProvider>
  )
}
