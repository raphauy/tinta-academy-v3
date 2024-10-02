import { getStudentDAO } from "@/services/student-services"
import { currentUser } from "@clerk/nextjs/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { User, Phone, MapPin, Mail, Calendar, Edit } from "lucide-react"
import { StudentDialog } from "@/app/admin/students/student-dialogs"
import { Button } from "@/components/ui/button"

export default async function MyData() {
  const user = await currentUser()
  if (!user) {
    return <div>Usuario no encontrado</div>
  }
  const metadata = user?.publicMetadata
  const studentId = metadata?.studentId as string
  if (!studentId) {
    return <div>No tienes permisos para acceder a esta página</div>
  }
  const student = await getStudentDAO(studentId)

  if (!student) {
    return <div>Datos del estudiante no encontrados</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-8">Mis Datos</h1>
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">Información Personal</CardTitle>
          <StudentDialog id={studentId} />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center">
            <User className="w-5 h-5 mr-2 text-muted-foreground" />
            <span className="font-medium">Nombre completo:</span>
            <span className="ml-2">{student.firstName} {student.lastName}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-muted-foreground" />
            <span className="font-medium">Fecha de nacimiento:</span>
            <span className="ml-2">{format(student.dateOfBirth, 'PPP', { locale: es })}</span>
          </div>
          <div className="flex items-center">
            <Mail className="w-5 h-5 mr-2 text-muted-foreground" />
            <span className="font-medium">Email:</span>
            <span className="ml-2">{student.email}</span>
          </div>
          <div className="flex items-center">
            <Phone className="w-5 h-5 mr-2 text-muted-foreground" />
            <span className="font-medium">Teléfono:</span>
            <span className="ml-2">{student.phone}</span>
          </div>
          <div className="flex items-start">
            <MapPin className="w-5 h-5 mr-2 mt-1 text-muted-foreground" />
            <span className="font-medium">Dirección:</span>
            <span className="ml-2">
              {student.address}, {student.city}, {student.zip}, {student.country}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}