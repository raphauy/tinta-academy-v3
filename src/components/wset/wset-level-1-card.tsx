'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, Clock, MapPin, Users, GraduationCap, Wine, DollarSign, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { CourseDAO } from "@/services/course-services"
import { EducatorDAO } from "@/services/educator-services"
import { getCourseLink, getCourseTitle, getCourseTypeLabel, getLevel } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"

type Props = {
  course: CourseDAO
  educator: EducatorDAO
}

export function WsetLevel1Card({ course, educator }: Props) {
  const startDate= course.classDates[0]
  if (!startDate) {
    return <div>No hay clases programadas</div>
  }
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
              src="/Wine_WSET.jpg"
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
            <span className="text-lg font-semibold">{format(startDate, 'PPP', { locale: es })}</span>
          </div>
        </div>
        <p className="text-muted-foreground mb-4">El WSET Level 1 Award in Wines es la puerta de entrada ideal al mundo del vino, diseñado para ofrecer una introducción práctica y estructurada. Este curso cubre desde los estilos principales de vino hasta las técnicas de almacenamiento, servicio y maridaje, capacitando a los participantes a realizar recomendaciones informadas y ofrecer un servicio de alta calidad.</p>
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
        <div className="mt-14 flex items-center justify-between">
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
            <Button asChild className="w-32">
              <Link href={courseLink}>Ver detalles</Link>
            </Button>
            <Button className="w-32">
              <Link href={`/cursos/inscripcion?courseId=${course.id}`}>
                Inscribite ahora
              </Link>
            </Button>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}