import { Separator } from "@/components/ui/separator"
import { BookOpen, GraduationCap, Home, Landmark, List, Megaphone, User } from "lucide-react"
import Link from "next/link"

const menu = [
  { name: "Dashboard", icon: Home, href: "/admin" },
  { name: "--dash--", icon: Home, href: "/" },
  { name: "Mis Cursos", icon: BookOpen, href: "#" },
  { name: "Mis Datos", icon: User, href: "#" },
  { name: "--dash--", icon: Home, href: "/" },
]

export default function StudentSideBar() {
  return (
    <div className="hidden border-r bg-muted/40 md:block pt-4">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex-1">
          <nav className="grid items-start px-2 font-medium lg:px-4">
            {menu.map((item, index) => {
              if (item.name === "--dash--") {
                return (
                  <Separator key={index} />
                )
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}

