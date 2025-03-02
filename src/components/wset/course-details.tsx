'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { CourseDAO } from "@/services/course-services"
import { CourseStatus } from "@prisma/client"
import { addHours, format, parse } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarDays, CheckCircleIcon, Clock, MapPin, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const defaultEducator = {
  name: "Gabi Zimmer",
  title: "WSET Certified Educator",
  bio: "Gabi es una experta en vinos con más de 10 años de experiencia en la industria. Educadora certificada WSET, jurado internacional de vinos, sommelier, autora y comunicadora."
}

type Props = {
  course: CourseDAO
  studentRegistered: boolean
  userObserving: boolean
}

export function CourseDetails({ course, studentRegistered, userObserving }: Props) {
  const examDate = course.examDate ? course.examDate.toLocaleDateString('es-UY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "Sin definir"
  const registrationDeadline = course.registrationDeadline ? course.registrationDeadline.toLocaleDateString('es-UY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "Sin definir"
  // format date to "Octubre 2024"
  const formatedDate = course.classDates[0] ? format(course.classDates[0], "MMMM yyyy", { locale: es }) : "Sin definir"

  const typeLabel= course.type === "TALLER" ? "Taller" : course.type === "CATA" ? "Cata" : "Curso"
  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-lg">
      <h1 className="text-4xl font-bold text-center">{course.title}</h1>
      <h2 className="text-muted-foreground text-center mb-8">{formatedDate}</h2>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Descripción</CardTitle>
        </CardHeader>
        <CardContent>
          {course.description}
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Modalidad del {typeLabel}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>Duración: {course.totalDuration} horas de formación presencial</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span>Lugar: {course.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span>Cupo máximo: {course.maxCapacity} personas</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Fechas del {typeLabel}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {course.classDates.map((date, index) => {
              const formatedDate = format(date, "PPP", { locale: es })
              const startTime= parse(course.startTime, "HH:mm", date)
              const formatedTime = format(startTime, "HH:mm", { locale: es })
              const endTime= addHours(startTime, course.classDuration)
              const formatedEndTime = format(endTime, "HH:mm", { locale: es })
              return (
              <div key={index} className="flex items-center space-x-2">
                <CalendarDays className="h-5 w-5 text-muted-foreground" />
                <span>{formatedDate} - {formatedTime} hs a {formatedEndTime} hs</span>
                </div>
              )
            })}
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <span>Fecha límite de inscripción: {registrationDeadline}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Inversión</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{course.priceUSD} USD <span className="text-sm font-normal text-muted-foreground">(IVA incluido)</span></p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Educator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 rounded-full overflow-hidden">
              <Image
                src={course.educator.imageUrl}
                alt={course.educator.name}
                width={96}
                height={96}
                className="object-cover rounded-full"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{course.educator.name}</h3>
              <p className="text-muted-foreground">{course.educator.title}</p>
              <p className="mt-2">{course.educator.bio}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mb-8">
      { course.status === CourseStatus.Inscribiendo && (
        <>
          <Button size="lg" className="font-bold" disabled={studentRegistered}>
            <Link href={`/cursos/inscripcion/${course.id}`} className="flex items-center">
              {studentRegistered ? "Ya estas inscripto" : "Inscribite ahora"}
              {studentRegistered && <CheckCircleIcon className="h-4 w-4 ml-2" />}
            </Link>
          </Button>
          <p className={cn("mt-2 text-sm text-muted-foreground", studentRegistered && "hidden")}>
            Para reservar tu lugar, hacé clic acá arriba y completa tus datos.
          </p>
        </>
        )}
      </div>

      {/* <div className="text-center mb-8">
        <ObserveButton courseId={course.id} userObserving={userObserving} />
      </div> */}

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Por favor, consulta nuestra <Link href="/politicas/ajuste-razonable" className="underline">Política de Ajustes Razonables</Link> y notifica a Tinta Academy si requieres asistencia especial.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Conoce todas las <Link href="/politicas" className="underline">Políticas de Tinta Academy</Link> disponibles en nuestro sitio web.
        </p>
      </div>
    </div>
  )
}