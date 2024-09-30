import * as z from "zod"
import { prisma } from "@/lib/db"
import { EducatorDAO } from "./educator-services"
import { CourseStatus, CourseType } from "@prisma/client"

export type CourseDAO = {
	id: string
	type: CourseType
  status: CourseStatus
	totalDuration: number
	startTime: string
	classDuration: number
	location: string | null | undefined
	maxCapacity: number
	priceUSD: number
	priceUYU: number
	classDates: Date[]
	examDate: Date | null | undefined
	registrationDeadline: Date | null | undefined
	educator: EducatorDAO
	educatorId: string
	createdAt: Date
	updatedAt: Date
}

export const courseSchema = z.object({
	type: z.nativeEnum(CourseType),
  status: z.nativeEnum(CourseStatus),
	totalDuration: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	startTime: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	classDuration: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	location: z.string().optional(),
	maxCapacity: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	priceUSD: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	priceUYU: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	examDate: z.date({required_error: "examDate is required."}).optional(),
	registrationDeadline: z.date({required_error: "registrationDeadline is required."}).optional(),
	educatorId: z.string().min(1, "educatorId is required."),
})

export type CourseFormValues = z.infer<typeof courseSchema>


export async function getCoursesDAO() {
  const found = await prisma.course.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
      educator: true
    }
  })

  return found as CourseDAO[]
}

export async function getStudentCoursesDAO(studentId: string | undefined) {
  if (!studentId) return []

  const found = await prisma.course.findMany({
    where: {
      orders: {
        some: {
          studentId
        }
      }
    }
  })

  return found as CourseDAO[]
}

export async function getCourseDAO(id: string) {
  const found = await prisma.course.findUnique({
    where: {
      id
    },
  })
  return found as CourseDAO
}
    
export async function createCourse(data: CourseFormValues) {
  //const clienteFinalPrice = data.clienteFinalPrice ? Number(data.clienteFinalPrice) : 0
  const priceUSD = data.priceUSD ? Number(data.priceUSD) : 0
  const priceUYU = data.priceUYU ? Number(data.priceUYU) : 0
  const totalDuration = data.totalDuration ? Number(data.totalDuration) : 0
  const classDuration = data.classDuration ? Number(data.classDuration) : 0
  const maxCapacity = data.maxCapacity ? Number(data.maxCapacity) : 0

  const created = await prisma.course.create({
    data: {
      ...data,
      priceUSD,
      priceUYU,
      totalDuration,
      classDuration,
      maxCapacity
    }
  })
  return created
}

export async function updateCourse(id: string, data: CourseFormValues) {
  const priceUSD = data.priceUSD ? Number(data.priceUSD) : 0
  const priceUYU = data.priceUYU ? Number(data.priceUYU) : 0
  const totalDuration = data.totalDuration ? Number(data.totalDuration) : 0
  const classDuration = data.classDuration ? Number(data.classDuration) : 0
  const maxCapacity = data.maxCapacity ? Number(data.maxCapacity) : 0

  const updated = await prisma.course.update({
    where: {
      id
    },
    data: {
      ...data,
      priceUSD,
      priceUYU,
      totalDuration,
      classDuration,
      maxCapacity
    }
  })
  return updated
}

export async function deleteCourse(id: string) {
  const deleted = await prisma.course.delete({
    where: {
      id
    },
  })
  return deleted
}
    
export async function findCourseByDateSlug(dateSlug: string, type: CourseType) {

  const futureCourses = await prisma.course.findMany({
    where: {
      type,
      examDate: {
        gte: new Date()
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      educator: true
    }
  })

  console.log(futureCourses)

  const slugDate = new Date(dateSlug)
  console.log(slugDate)

  const result= futureCourses.filter(course => course.classDates.some(date => date.getFullYear() === slugDate.getFullYear() && date.getMonth() === slugDate.getMonth()))

  if (result.length === 0) return null

  return result[0]
}

export async function getFirstCourseAnounced(type: CourseType) {
  const found = await prisma.course.findFirst({
    where: {
      type,
      status: CourseStatus.Anunciado
    },
    orderBy: {
      createdAt: 'asc'
    },
    include: {
      educator: true
    }
  })
  return found
}

export async function setClassDates(id: string, dates: Date[], startTime: string): Promise<boolean> {
  const updated = await prisma.course.update({
    where: {
      id
    },
    data: {
      classDates: dates,
      startTime
    }
  })
  return true
}