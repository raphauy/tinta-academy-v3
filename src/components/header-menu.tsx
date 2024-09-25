'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Book, BookOpen, Calendar, GraduationCap, Home, LayoutDashboard, Mail, Menu } from "lucide-react"
import { useAuth, useUser } from '@clerk/nextjs'
import { cn } from '@/lib/utils'

const menuItems = [
  { icon: Home, label: "Inicio", href: '/', roles: [], disabled: false },
  { icon: BookOpen, label: "Cursos", href: '/cursos', roles: [], disabled: false },
  { icon: Mail, label: "Contacto", href: '/contact', roles: [], disabled: true },
  { icon: Calendar, label: "Próximos cursos", href: '/coming-soon', roles: [], disabled: true},
  { icon: LayoutDashboard, label: "Admin", href: '/admin', roles: ["admin"], disabled: false },
]

export function HeaderMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()  
  const { user } = useUser()
  const metadata = user?.publicMetadata
  const role = metadata?.role as string

  const isItemActive = (href: string) => pathname === href
  const canAccess = (roles: string[]) => roles.length > 0 ? roles.includes(role) : true

  const MenuItem = ({ item }: { item: typeof menuItems[0] }) => (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-2 px-4 py-2 font-bold transition-colors rounded-full",
        isItemActive(item.href) ? 'bg-primary text-primary-foreground' : "text-foreground hover:bg-accent hover:text-accent-foreground",
        item.disabled && "hidden",
        canAccess(item.roles) ? '' : 'hidden'
      )}
      onClick={() => setIsOpen(false)}
    >
      {item.icon && <item.icon className="h-4 w-4 mb-0.5" />}
      {item.label}
    </Link>
  )

  return (
    <div className="w-full flex justify-between items-center md:justify-center">
      {/* Versión móvil */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <Link href="/" className="flex items-center gap-2 font-semibold">
              <GraduationCap className="h-6 w-6" />
              <span className='text-xl font-bold whitespace-nowrap'>Tinta Academy</span>
          </Link>

          <nav className="flex flex-col space-y-4 mt-4">
            {menuItems.map((item) => (
              <MenuItem key={item.href} item={item} />
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Versión de escritorio */}
      <nav className="hidden md:block">
        <div className="flex items-center space-x-4 rounded-full bg-secondary p-1 shadow-sm">
          {menuItems.map((item) => (
            <MenuItem key={item.href} item={item} />
          ))}
        </div>
      </nav>
    </div>
  )
}