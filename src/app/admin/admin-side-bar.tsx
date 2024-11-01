import { Separator } from "@/components/ui/separator"
import { BookOpen, GraduationCap, Home, Landmark, List, Megaphone, Ticket, User } from "lucide-react"
import Link from "next/link"

const menu = [
  { name: "Dashboard", icon: Home, href: "/admin" },
  { name: "--dash--", icon: Home, href: "/" },
  { name: "Cursos", icon: BookOpen, href: "/admin/courses" },
  { name: "Interesados", icon: Megaphone, href: "/admin/interest" },
  { name: "--dash--", icon: Home, href: "/" },
  { name: "Estudiantes", icon: User, href: "/admin/students" },
  { name: "Educators", icon: GraduationCap, href: "/admin/educators" },
  { name: "Usuarios", icon: User, href: "/admin/users" },
  { name: "--dash--", icon: Home, href: "/" },
  { name: "Datos Bancarios", icon: Landmark, href: "/admin/bankdatas" },
  { name: "Ordenes de Pago", icon: List, href: "/admin/orders" },
  { name: "--dash--", icon: Home, href: "/" },
  { name: "Cupones", icon: Ticket, href: "/admin/coupons" },
  { name: "--dash--", icon: Home, href: "/" },
]

export default function AdminSideBar() {
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
        {/* <div className="mt-auto p-4">
          <Card x-chunk="dashboard-02-chunk-0">
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle>Upgrade to Pro</CardTitle>
              <CardDescription>
                Unlock all features and get unlimited access to our support
                team.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              <Button size="sm" className="w-full">
                Upgrade
              </Button>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </div>
  )
}

