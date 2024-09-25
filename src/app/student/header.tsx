import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SignedIn, UserButton } from "@clerk/nextjs"
import { BookOpen, Home, Menu, Search } from "lucide-react"
import Link from "next/link"
import React from "react"

const menu = [
  { name: "Dashboard", icon: Home, href: "/" },
  { name: "WSET 01", icon: BookOpen, href: "/wset-01" },
  { name: "WSET 02", icon: BookOpen, href: "/wset-02" },
  { name: "WSET 03", icon: BookOpen, href: "/wset-03" },
  { name: "WSET 04", icon: BookOpen, href: "/wset-04" },
]

const Header: React.FC = () => {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px]">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            {menu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <item.icon className="h-6 w-6" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="mt-auto">
            <Card>
              <CardHeader>
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our
                  support team.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar cursos..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
      <SignedIn>
        <UserButton />
      </SignedIn>

    </header>
  )
}

export default Header