'use client'

import { AddDatesDialog, CourseDialog, DeleteCourseDialog } from "@/app/admin/courses/course-dialogs"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { CourseDAO } from "@/services/course-services"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarDays, Clock, DollarSign, MapPin, Users } from "lucide-react"
import Image from "next/image"
import { Badge } from "../../../components/ui/badge"
import StudentsDialog from "./students-dialog"
import { CourseImageField } from "@/components/course-image-field"
import { getCourseTypeLabel } from "@/lib/utils"

type Props = {
  course: CourseDAO
}

export function CourseCard({ course }: Props) {
  const startDate = course.classDates[0]
  const formatedStartDate = startDate ? format(startDate, 'PPP', { locale: es }) : "Sin definir"
  
  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-300 flex flex-col h-full overflow-hidden">
      <div className="w-full h-48 relative">
        <CourseImageField courseId={course.id} imageUrl={course.imageUrl} />
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="secondary" className="font-semibold border border-muted-foreground">
            {getCourseTypeLabel(course.type)}
          </Badge>
        </div>
      </div>
      
      <CardContent className="flex-grow pt-6">
        <div className="flex flex-col space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <CardTitle className="text-xl truncate max-w-[90%]" title={course.title}>
                {course.title}
              </CardTitle>
            </div>
            
            <div className="flex justify-between items-center">
              <Badge variant="course">{course.status}</Badge>
              
              <div className="flex items-center bg-primary/10 rounded-full px-3 py-1">
                <CalendarDays className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm font-medium">{formatedStartDate}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
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
              <span>{course.location}</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
              <Image
                src={course.educator.imageUrl}
                alt={course.educator.name}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-sm">{course.educator.name}</p>
              <p className="text-xs text-muted-foreground">{course.educator.title}</p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2 pb-4">
        <StudentsDialog courseId={course.id} />
        
        <div className="flex items-center gap-2">
          <AddDatesDialog id={course.id} initialDates={course.classDates} initialStartTime={course.startTime} />
          <CourseDialog id={course.id} />
          <DeleteCourseDialog id={course.id} description="¿Estás seguro de que quieres eliminar este curso?"/>
        </div>
      </CardFooter>
    </Card>
  )
}