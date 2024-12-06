import Link from 'next/link'

import { ThemeToggle } from '@/components/theme-toggle'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger
} from '@/components/ui/sheet'

import { GraduationCap, Menu } from 'lucide-react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { Button } from './ui/button'
import { HeaderMenu } from './header-menu'
import Logo from './logo'

export default function Header() {
  return (
    <header className='fixed inset-x-0 top-0 z-50 bg-background/20 py-4 backdrop-blur-sm'>
      <nav className='px-4 flex items-center justify-between mx-auto'>

        <ul className='hidden items-center gap-14 text-sm font-medium md:flex'>
          <li className='font-serif text-lg font-bold'>
            <Logo />
          </li>
        </ul>

        <HeaderMenu />

        <div className='flex'>
          <div className='w-10'>
            <ThemeToggle />
          </div>

          <div className='min-w-10'>
            <SignedIn>
                <UserButton />
            </SignedIn>

            <SignedOut>
                <SignInButton>
                <Button>Ingresar</Button>
                </SignInButton>
            </SignedOut>
          </div>
        </div>
      </nav>
    </header>
  )
}