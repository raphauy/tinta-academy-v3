"use client"

import Image from 'next/image'
import { useTheme } from 'next-themes'

export default function Logo() {
  const { theme } = useTheme()
  
  return (
    <div className="relative w-40 h-12">
      <Image
        src={theme === 'dark' 
          ? '/TintaAcademy_Logo_Blanco.png'
          : '/TintaAcademy_Logo_Negro.png'
        }
        alt="Tinta Academy Logo"
        fill
        className="object-contain"
        priority
      />
    </div>
  )
}