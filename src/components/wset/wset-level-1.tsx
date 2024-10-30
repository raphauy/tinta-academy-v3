'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, MapPin, Users, GraduationCap, Wine, User, CheckCircleIcon } from "lucide-react"
import Image from "next/image"
import { CourseDAO } from "@/services/course-services"
import { EducatorDAO } from "@/services/educator-services"
import { addHours, format, parse } from "date-fns"
import { es } from "date-fns/locale"
import { cn, getCourseTitle, getLevel } from "@/lib/utils"
import Link from "next/link"
import { ObserveButton } from "@/app/cursos/observe-button"

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

export function WsetLevel1({ course, studentRegistered, userObserving }: Props) {
  const examDate = course.examDate ? course.examDate.toLocaleDateString('es-UY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "Sin definir"
  const registrationDeadline = course.registrationDeadline ? course.registrationDeadline.toLocaleDateString('es-UY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "Sin definir"
  // format date to "Octubre 2024"
  const formatedDate = course.classDates[0] ? format(course.classDates[0], "MMMM yyyy", { locale: es }) : "Sin definir"
  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-lg">
      <h1 className="text-4xl font-bold text-center">{getCourseTitle(course.type)}</h1>
      <h2 className="text-muted-foreground text-center mb-8">{formatedDate}</h2>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Descripción</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            WSET Nivel 1 Cualificación en Vinos es la puerta de entrada ideal al mundo del vino, diseñado para ofrecer una introducción práctica y estructurada. Este curso cubre desde los estilos principales de vino hasta las técnicas de almacenamiento, servicio y maridaje, capacitando a los participantes a realizar recomendaciones informadas y ofrecer un servicio de alta calidad.
          </p>
          <p className="mt-4 text-muted-foreground">
            Durante el curso, se explorarán los diferentes tipos y estilos de vino mediante la cata guiada, desarrollando habilidades clave para describir los vinos con precisión y conocer la recomendación con el tipo de comida adecuada. Al completar el curso con éxito, se recibirá un certificado WSET reconocido internacionalmente y un pin de solapa.
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
              <li>Los principales tipos y estilos de vino.</li>
              <li>Uvas de vinificación comunes y sus características.</li>
              <li>Técnicas de maridaje de comida y vino.</li>
              <li>Cata de vinos guiada.</li>
              <li>Métodos de almacenamiento y servicio de vinos.</li>
              <li>Uso del Enfoque Sistemático para la Cata de Vino® (SAT) de Nivel 1 de WSET.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Este curso es para vos si:</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Estás comenzando una carrera enológica.</li>
              <li>Te estás preparando para tu primer trabajo en la industria del vino.</li>
              <li>Formas parte del sector hotelero y queres capacitar a tu equipo.</li>
              <li>Si sos un entusiasta del vino que quiere profundizar en su conocimiento.</li>
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
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5 text-muted-foreground" />
              <span>Examen: 30 preguntas, 45 minutos, 70% para aprobar</span>
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
            <li>Materiales de estudio: cuaderno de ejercicios WSET Nivel 1</li>
            <li>Matrícula completa</li>
            <li>Cata de 9 vinos durante el curso</li>
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
        <Button size="lg" className="font-bold" disabled={studentRegistered}>
          <Link href={`/cursos/inscripcion/${course.id}`} className="flex items-center">
            {studentRegistered ? "Ya estas inscripto" : "Inscribite ahora"}
            {studentRegistered && <CheckCircleIcon className="h-4 w-4 ml-2" />}
          </Link>
        </Button>
        <p className={cn("mt-2 text-sm text-muted-foreground", studentRegistered && "hidden")}>
          Para reservar tu lugar, hacé clic acá arriba y completa tus datos.
        </p>
      </div>

      <div className="text-center mb-8">
        <ObserveButton courseId={course.id} userObserving={userObserving} />
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Requisitos de Inscripción</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>No existen restricciones para participar en el Nivel 1 en Vinos de la WSET.</li>
            <li>No se requieren conocimientos previos.</li>
            <li>Los estudiantes deben ser mayores de 18 años, la edad mínima legal para la compra de bebidas alcohólicas en Uruguay.</li>
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