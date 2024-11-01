'use client'

import { AddDatesDialog, CourseDialog, DeleteCourseDialog } from "@/app/admin/courses/course-dialogs"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { CourseDAO } from "@/services/course-services"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarDays, Clock, DollarSign, MapPin, Users } from "lucide-react"
import Image from "next/image"

type Props = {
  course: CourseDAO
}

export function CourseCard({ course }: Props) {
  const startDate = course.classDates[0]
  const formatedStartDate = startDate ? format(startDate, 'PPP', { locale: es }) : "Sin definir"
  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-300">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <CardTitle className="text-2xl mb-2 sm:mb-0">{course.title}</CardTitle>
          <div className="flex items-center bg-primary/10 rounded-full px-4 py-2">
            <CalendarDays className="h-6 w-6 mr-2 text-primary" />
            <span className="text-lg font-semibold">{formatedStartDate}</span>
          </div>
        </div>
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
            <AddDatesDialog id={course.id} initialDates={course.classDates} initialStartTime={course.startTime} />
            <CourseDialog id={course.id} />
            <DeleteCourseDialog id={course.id} description="¿Estás seguro de que quieres eliminar este curso?"/>
          </div>

        </div>
      </CardContent>

    </Card>
  )
}