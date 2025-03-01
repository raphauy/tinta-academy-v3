import { prisma } from "@/lib/db"
import { CourseStatus, CourseType } from "@prisma/client"
import * as z from "zod"
import { EducatorDAO } from "./educator-services"
import { getUserByClerkUserId } from "./user-services"

export type CourseDAO = {
	id: string
	type: CourseType
  status: CourseStatus
	title: string
	slug: string
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
	description: string | null | undefined
	educator: EducatorDAO
	educatorId: string
	createdAt: Date
	updatedAt: Date
}

export const courseSchema = z.object({
	type: z.nativeEnum(CourseType),
  status: z.nativeEnum(CourseStatus),
	title: z.string(),
	slug: z.string(),
	totalDuration: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	startTime: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	classDuration: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	location: z.string().optional(),
	maxCapacity: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	priceUSD: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	priceUYU: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	examDate: z.date({required_error: "examDate is required."}).optional(),
	registrationDeadline: z.date({required_error: "registrationDeadline is required."}).optional(),
  description: z.string().optional(),
	educatorId: z.string().min(1, "educatorId is required."),
})

export type CourseFormValues = z.infer<typeof courseSchema>


export async function getCoursesDAO() {
  const found = await prisma.course.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
      educator: true,
    }
  })

  return found as CourseDAO[]
}

export async function getActiveCoursesDAO() {
  const found = await prisma.course.findMany({
    where: {
      status: {
        not: CourseStatus.Finalizado
      }
    },
    include: {
      educator: true,
    },
    orderBy: {
      startTime: 'asc'
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
    },
    include: {
      educator: true,
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
    
export async function findCourseBySlug(slug: string) {
  const found = await prisma.course.findUnique({
    where: {
      slug
    },
    include: {
      educator: true
    }
  })
  return found
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

// model CourseObserver {
//   user        User     @relation(fields: [userId], references: [id])
//   userId      String
//   course      Course   @relation(fields: [courseId], references: [id])
//   courseId    String
//   clerkUserId String
//   createdAt   DateTime @default(now())

//   @@id([userId, courseId])
// }
export async function observeCourse(clerkUserId: string, courseId: string) {
  const user= await getUserByClerkUserId(clerkUserId)
  if (!user) {
    throw new Error("Usuario no encontrado")
  }
  // check if exists
  const found = await prisma.courseObserver.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId
      }
    }
  })
  if (found) {
    throw new Error("El usuario ya está asociado a este curso")
  }
  const created = await prisma.courseObserver.create({
    data: {
      userId: user.id,
      courseId,
      clerkUserId
    }
  })
  return created
}

export async function removeCourseObserver(clerkUserId: string, courseId: string) {
  const user= await getUserByClerkUserId(clerkUserId)
  if (!user) {
    throw new Error("Usuario no encontrado")
  }
  const deleted = await prisma.courseObserver.delete({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId
      }
    }
  })
  return deleted
}

export async function getCourseObservers(courseId: string) {
  const found = await prisma.courseObserver.findMany({
    where: {
      courseId
    },
    include: {
      user: true      
    }
  })
  console.log("courseObservers count: ", found.length)
  const users= []
  for (const observer of found) {
    const name= observer.user.firstName ? observer.user.firstName + " " + observer.user.lastName : ""
    users.push({
      name,
      email: observer.user.email
    })
  }
  console.log("users: ", users)
  return users
}

type CourseWithObserver= {
  id: string
  label: string
  users: {
    name: string
    email: string
  }[]
}
export async function getCoursesWithObservers(): Promise<CourseWithObserver[]> {

  const res: CourseWithObserver[]= []

  const courses= await getCoursesDAO()
  console.log("courses count: ", courses.length)

  for (const course of courses) {
    const users= await getCourseObservers(course.id)
    const label= course.title
    res.push({
      id: course.id,
      label,
      users
    })
  }

  return res

}

export async function getObservedCoursesIds(clerkUserId: string) {
  if (!clerkUserId) return []
  
  const res: string[]= []
  const found = await prisma.courseObserver.findMany({
    where: {
      clerkUserId
    }
  })
  for (const observer of found) {
    res.push(observer.courseId)
  }
  return res
}

export async function getActiveCourses() {
  const found = await prisma.course.findMany({
    where: {
      status: {
        in: [CourseStatus.Anunciado, CourseStatus.Inscribiendo]
      }
    },
    include: {
      educator: true
    }
  })
  return found
}

export async function checkSlug(slug: string, courseId?: string) {
  let originalSlug
  if (courseId) {
    const course= await prisma.course.findUnique({
      where: {
        id: courseId
      },
      select: {
        slug: true
      } 
    })    
    originalSlug= course?.slug
  }
  console.log("originalSlug: ", originalSlug)
  const found = await prisma.course.findUnique({
    where: {
      slug
    }
  })
  console.log("found: ", found)
  if (!found) {
    return false
  }
  console.log("found.slug: ", found?.slug)
  if (found.slug === originalSlug) {
    return false
  }
  console.log("true")
  return true
}