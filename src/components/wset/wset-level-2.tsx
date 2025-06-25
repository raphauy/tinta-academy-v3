'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { CourseDAO } from "@/services/course-services"
import { CourseStatus } from "@prisma/client"
import { addHours, format, parse } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarDays, CheckCircleIcon, Clock, GraduationCap, MapPin, Users } from "lucide-react"
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

export function WsetLevel2({ course, studentRegistered, userObserving }: Props) {
  const examDate = course.examDate ? course.examDate.toLocaleDateString('es-UY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "Sin definir"
  const registrationDeadline = course.registrationDeadline ? course.registrationDeadline.toLocaleDateString('es-UY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "Sin definir"
  const formatedDate = course.classDates[0] ? format(course.classDates[0], "MMMM yyyy", { locale: es }) : "Sin definir"
  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-lg">
      <h1 className="text-4xl font-bold text-center">{course.title}</h1>
      <h2 className="text-muted-foreground text-center mb-8">{formatedDate}</h2>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Descripción</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            El WSET Nivel 2 es una calificación intermedia diseñada para profundizar el conocimiento del vino. Este curso explora en detalle las variedades de uva, las regiones clave y cómo los factores ambientales influyen en el estilo y la calidad del vino.
          </p>
          <p className="mt-4 text-muted-foreground">
            Al completar con éxito, recibirás un certificado internacional WSET. Este curso es ideal tanto para profesionales de la industria como para entusiastas avanzados que desean expandir sus conocimientos sobre el vino.
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>¿Qué vas a aprender?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Cómo catar y describir vinos usando el Enfoque Sistemático (SAT).</li>
              <li>Variedades de uva principales y sus características.</li>
              <li>Factores ambientales y de elaboración que influyen en el vino.</li>
              <li>Técnicas de almacenamiento y servicio de vinos.</li>
              <li>Principios de maridaje de comida y vino.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Este curso es para vos si:</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Estás comenzando o consolidando tu carrera enológica.</li>
              <li>Trabajas en la industria del vino o la hospitalidad y quieres mejorar tu servicio.</li>
              <li>Eres un entusiasta avanzado del vino y deseas profundizar tu conocimiento.</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Modalidad del Curso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>Duración total: {course.totalDuration} horas</span>
              </div>
              <ul className="list-disc pl-5 text-muted-foreground text-sm ml-7">
                <li>16 horas presenciales</li>
                <li>11 horas de estudio personal y revisión.</li>
                <li>Examen de 1 hora.</li>
              </ul>
            </div>
            <div className="flex space-x-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span>Lugar: {course.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span>Cupo máximo: {course.maxCapacity} personas</span>
            </div>
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5 text-muted-foreground" />
              <span>Examen: 50 preguntas, 60 minutos, 55% para aprobar</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Fechas del Curso</CardTitle>
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
                <span>Clase {index + 1}: {formatedDate} - {formatedTime} hs a {formatedEndTime} hs</span>
              </div>
              )
            })}
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <span>Examen: {examDate}</span>
            </div>
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
          <p className="mt-4 font-semibold">El curso incluye:</p>
          <ul className="list-disc pl-5 mt-2 space-y-2 text-muted-foreground">
            <li>Materiales de estudio: cuaderno de ejercicios WSET Nivel 2.</li>
            <li>Matrícula completa</li>
            <li>Cata de una selección de 40 vinos</li>
            <li>Examen final</li>
            <li>Certificación internacional WSET con Diploma Digital</li>
          </ul>
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
            Para reservar tu lugar, hacé clic acá y completa tus datos.
          </p>
        </>
        )}
      </div>

      {/* <div className="text-center mb-8">
        <ObserveButton courseId={course.id} userObserving={userObserving} />
      </div> */}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Requisitos de Inscripción</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>No se requieren conocimientos previos.</li>
            <li>Los estudiantes deben ser mayores de 18 años.</li>
            <li>Se solicitará una identificación con foto el día del curso/examen.</li>
          </ul>
        </CardContent>
      </Card>

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
