import * as z from "zod"
import { prisma } from "@/lib/db"
import { EducatorDAO } from "./educator-services"
import { CourseType } from "@prisma/client"

export type CourseDAO = {
	id: string
	type: CourseType
	totalDuration: number
	startTime: string
	classDuration: number
	location: string
	maxCapacity: number
	priceUSD: number
	priceUYU: number
	classDates: Date[]
	examDate: Date
	registrationDeadline: Date
	educator: EducatorDAO
	educatorId: string
	createdAt: Date
	updatedAt: Date
}

export const courseSchema = z.object({
	type: z.nativeEnum(CourseType),
	totalDuration: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	startTime: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	classDuration: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	location: z.string().min(1, "location is required."),
	maxCapacity: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	priceUSD: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	priceUYU: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
  classDates: z.array(z.date()),
	examDate: z.date({required_error: "examDate is required."}),
	registrationDeadline: z.date({required_error: "registrationDeadline is required."}),
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
    
export async function findCourseByDateSlug(dateSlug: string) {
  const date = new Date(dateSlug)

  const futureCourses = await prisma.course.findMany({
    where: {
      examDate: {
        gte: new Date()
      }
    },
    include: {
      educator: true
    }
  })

  console.log(futureCourses)

  const result= futureCourses.filter(course => course.classDates.some(date => date.getFullYear() === date.getFullYear() && date.getMonth() === date.getMonth()))

  return result
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