'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCourseLink, getCourseTitle, getLevel } from "@/lib/utils"
import { CourseDAO } from "@/services/course-services"
import { EducatorDAO } from "@/services/educator-services"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarDays, CheckCircleIcon, Clock, DollarSign, MapPin, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ObserveButton } from "./observe-button"

type Props = {
  course: CourseDAO
  studentRegistered: boolean
  userObserving: boolean
}

export function WsetCard({ course, studentRegistered, userObserving }: Props) {
  const courseLevel= getLevel(course.type)  
  const shortDescription= shortDescriptions[courseLevel - 1]
  const startDate= course.classDates[0]
  const formatedStartDate = startDate ? format(startDate, 'PPP', { locale: es }) : "Sin definir"
  const courseLink = getCourseLink(course)
  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="relative pb-0">
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="secondary" className="font-semibold border border-muted-foreground">
            Nivel {getLevel(course.type)}
          </Badge>
        </div>
        <div className="relative w-full h-64 sm:h-80 rounded-t-lg overflow-hidden">
          <Link href={courseLink}>
            <Image
              src={`/Card_WSET_${courseLevel}.jpg`}
            alt="WSET course"
            layout="fill"
              objectFit="cover"
            />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <CardTitle className="text-2xl mb-2 sm:mb-0">{getCourseTitle(course.type)}</CardTitle>
          <div className="flex items-center bg-primary/10 rounded-full px-4 py-2">
            <CalendarDays className="h-6 w-6 mr-2 text-primary" />
            <span className="text-lg font-semibold">{formatedStartDate}</span>
          </div>
        </div>
        <p className="text-muted-foreground mb-4">{shortDescription}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
            <span>{course.totalDuration} horas</span>
          </div>
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-muted-foreground" />
            <span>Máx. {course.maxCapacity}</span>
          </div>
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-muted-foreground" />
            <span>{course.priceUSD} USD</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
            <span>{course.location}</span>
          </div>
        </div>
        <div className="mt-14 md:flex md:items-center md:justify-between grid gap-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
              <Image
                src={course.educator.imageUrl}
                alt={course.educator.name}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-semibold">{course.educator.name}</p>
              <p className="text-sm text-muted-foreground">{course.educator.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild className="w-40 font-bold">
              <Link href={courseLink}>Ver detalles</Link>
            </Button>
            <Button className="w-40" disabled={studentRegistered}>
              <Link href={`/cursos/inscripcion/${course.id}`} className="flex items-center font-bold">
                {studentRegistered ? "Ya estas inscripto" : "Inscribite ahora"}
                {studentRegistered && <CheckCircleIcon className="h-4 w-4 ml-2" />}
              </Link>
            </Button>
            <ObserveButton courseId={course.id} userObserving={userObserving} />
          </div>

        </div>
      </CardContent>
    </Card>
  )
}


const shortDescriptions= [
  "WSET Nivel 1 es la puerta de entrada ideal al mundo del vino, diseñado para ofrecer una introducción práctica y estructurada. Este curso cubre desde los estilos principales de vino hasta las técnicas de almacenamiento, servicio y maridaje, capacitando a los participantes a realizar recomendaciones informadas y ofrecer un servicio de alta calidad.",
  "El WSET Nivel 2 es una calificación intermedia diseñada para profundizar el conocimiento del vino. Este curso explora las variedades de uva más importantes, las regiones clave, y te capacita para describir los vinos con confianza."
]