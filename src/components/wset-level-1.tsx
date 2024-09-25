'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, MapPin, Users, GraduationCap, Wine, User } from "lucide-react"
import Image from "next/image"
import { CourseDAO } from "@/services/course-services"
import { EducatorDAO } from "@/services/educator-services"
import { addHours, format, parse } from "date-fns"
import { es } from "date-fns/locale"
import { getCourseTitle } from "@/lib/utils"

// const defaultCourse = {
//   type: "WSET_LEVEL_1",
//   totalDuration: 6,
//   classDuration: 2,
//   location: "Hotel Costanero MGallery, Montevideo",
//   maxCapacity: 15,
//   priceUSD: 450,
//   priceUYU: 10000,
//   classDates: [
//     new Date("2024-10-15T18:30:00"),
//     new Date("2024-10-22T18:30:00"),
//     new Date("2024-10-29T18:30:00")
//   ],
//   examDate: new Date("2024-10-29T18:30:00"),
//   registrationDeadline: new Date("2024-10-11")
// }

const defaultEducator = {
  name: "Gabi Zimmer",
  title: "WSET Certified Educator",
  bio: "Gabi es una experta en vinos con más de 10 años de experiencia en la industria. Educadora certificada WSET, jurado internacional de vinos, sommelier, autora y comunicadora."
}

type Props = {
  course: CourseDAO
  educator: EducatorDAO
}

export function WsetLevel1({ course, educator }: Props) {
  // format date to "Octubre 2024"
  const firstClassDate = course.classDates[0]
  if (!firstClassDate) {
    return <div>El curso no tiene clases programadas</div>
  }
  const formatedDate = format(firstClassDate, "MMMM yyyy", { locale: es })
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
            El WSET Level 1 Award in Wines es la puerta de entrada ideal al mundo del vino, diseñado para ofrecer una introducción práctica y estructurada. Este curso cubre desde los estilos principales de vino hasta las técnicas de almacenamiento, servicio y maridaje, capacitando a los participantes a realizar recomendaciones informadas y ofrecer un servicio de alta calidad.
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
              <span>Examen: {course.examDate.toLocaleDateString('es-UY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <span>Fecha límite de inscripción: {course.registrationDeadline.toLocaleDateString('es-UY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
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
            <li>Certificación internacional WSET y pin de solapa</li>
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
                src={educator.imageUrl}
                alt={educator.name}
                width={96}
                height={96}
                className="object-cover rounded-full"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{educator.name}</h3>
              <p className="text-muted-foreground">{educator.title}</p>
              <p className="mt-2">{educator.bio}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mb-8">
        <Button size="lg" className="font-bold" disabled>
          Inscribite ahora
        </Button>
        <p className="mt-2 text-sm text-muted-foreground">
          Para reservar tu lugar, hacé clic acá y completa tus datos.
        </p>
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
          Por favor, consulta nuestra Política de Ajustes Razonables y notifica a Tinta Academy si requieres asistencia especial.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Conoce todas las Políticas de Tinta Academy disponibles en nuestro sitio web.
        </p>
      </div>
    </div>
  )
}