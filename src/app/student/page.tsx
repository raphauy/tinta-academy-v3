import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, User } from "lucide-react"

export default function Dashboard() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-col items-center justify-center gap-10 rounded-lg border border-dashed shadow-sm p-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Bienvenido a tu panel de estudiante
        </h1>
        <p className="text-sm text-muted-foreground">
          ¿Qué te gustaría ver?
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/student/courses" className="flex items-center">
              <BookOpen className="mr-2 h-4 w-4" />
              Mis Cursos
            </Link>
          </Button>
          <Button asChild>
            <Link href="/student/my-data" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              Mis Datos
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
