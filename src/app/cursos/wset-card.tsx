'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CardTitle } from "@/components/ui/card"
import { getCourseLink, getCourseTypeLabel, getLevel } from "@/lib/utils"
import { CourseDAO } from "@/services/course-services"
import { CourseStatus } from "@prisma/client"
import { endOfDay, format, isAfter } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarDays, CheckCircleIcon, Clock, DollarSign, MapPin, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type Props = {
  course: CourseDAO
  studentRegistered: boolean
  userObserving: boolean
}

export function WsetCard({ course, studentRegistered, userObserving }: Props) {
  const courseLevel = getLevel(course.type)  
  const shortDescription = courseLevel === 0 ? course.description : shortDescriptions[courseLevel - 1]
  const startDate = course.classDates[0]
  const formatedStartDate = startDate ? format(startDate, 'd \'de\' MMMM yyyy', { locale: es }) : "Sin definir"
  const courseLink = getCourseLink(course)
  const inscriptionDateLimit = course.registrationDeadline
  const isOutdated = inscriptionDateLimit && isAfter(new Date(), endOfDay(inscriptionDateLimit)) ? true : false
  
  return (
    <div className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <div className="relative">
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="secondary" className="font-semibold border border-muted-foreground">
            {
              courseLevel === 0 ? getCourseTypeLabel(course.type) : "Nivel " + getLevel(course.type)
            }
          </Badge>
        </div>
        <div className="relative w-full h-52">
          <Link href={courseLink}>
            <Image
              src={course.type.startsWith("WSET") ? `/Card_WSET_${courseLevel}.jpg` : `/Card_${course.type}.jpg`}
              alt="WSET course"
              fill
              className="object-cover transition-transform hover:scale-105"
            />
          </Link>
        </div>
      </div>
      
      <div className="flex flex-col flex-grow p-5">
        <div className="flex items-center justify-between mb-3">
          <CardTitle className="text-xl line-clamp-1">{course.title}</CardTitle>
          <div className="flex items-center bg-primary/10 rounded-full px-3 py-1 text-sm">
            <CalendarDays className="h-4 w-4 mr-1 text-primary" />
            <span className="font-medium whitespace-nowrap">{formatedStartDate}</span>
          </div>
        </div>
        
        <div className="mb-4 min-h-[4.5rem]">
          <p className="text-muted-foreground text-sm line-clamp-3">
            {shortDescription || ""}
            {shortDescription && shortDescription.length > 150 && "..."}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{course.totalDuration} horas</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Máx. {course.maxCapacity}</span>
          </div>
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{course.priceUSD} USD</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="truncate">{course.location}</span>
          </div>
        </div>
        
        <div className="mt-auto pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                <Image
                  src={course.educator.imageUrl}
                  alt={course.educator.name}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="font-semibold truncate">{course.educator.name}</p>
                <p className="text-xs text-muted-foreground truncate">{course.educator.title}</p>
              </div>
            </div>
            
            <Button asChild variant="outline" className="font-medium text-sm h-9">
              <Link href={courseLink}>Ver detalles</Link>
            </Button>
          </div>
          
          {course.status === CourseStatus.Inscribiendo && (
            <div className="mt-4">
              <Button 
                className="w-full font-medium text-sm h-9" 
                disabled={studentRegistered || isOutdated}
                asChild={!studentRegistered && !isOutdated}
              >
                {!studentRegistered && !isOutdated ? (
                  <Link href={`/cursos/inscripcion/${course.id}`}>
                    Inscribirse
                  </Link>
                ) : (
                  <span className="flex items-center justify-center">
                    {studentRegistered ? (
                      <>Ya inscripto <CheckCircleIcon className="h-4 w-4 ml-1" /></>
                    ) : (
                      "Inscripción cerrada"
                    )}
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const shortDescriptions = [
  "WSET Nivel 1 es la puerta de entrada ideal al mundo del vino, diseñado para ofrecer una introducción práctica y estructurada. Este curso cubre desde los estilos principales de vino hasta las técnicas de almacenamiento, servicio y maridaje, capacitando a los participantes a realizar recomendaciones informadas y ofrecer un servicio de alta calidad.",
  "El WSET Nivel 2 es una calificación intermedia diseñada para profundizar el conocimiento del vino. Este curso explora las variedades de uva más importantes, las regiones clave, y te capacita para describir los vinos con confianza."
]