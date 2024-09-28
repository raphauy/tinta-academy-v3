import { CourseDAO } from "@/services/course-services"
import { CourseType } from "@prisma/client"
import { clsx, type ClassValue } from "clsx"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCourseTypeLabel(type: CourseType | string) {
  switch (type) {
    case CourseType.WSET_LEVEL_1:
      return "WSET Level 1"
    case CourseType.WSET_LEVEL_2:
      return "WSET Level 2"
    case CourseType.WSET_LEVEL_3:
      return "WSET Level 3"
    case CourseType.WSET_LEVEL_4:
      return "WSET Level 4"
    default:
      return "Otro"
  }
}

export function getCourseTitle(type: CourseType) {
  switch (type) {
    case CourseType.WSET_LEVEL_1:
      return "WSET Level 1 Award in Wines"
    case CourseType.WSET_LEVEL_2:
      return "WSET Level 2 Award in Wines"
    case CourseType.WSET_LEVEL_3:
      return "WSET Level 3 Award in Wines"
    case CourseType.WSET_LEVEL_4:
      return "WSET Level 4 Award in Wines"
    default:
      return "Otro"
  }
}

export function getLevel(type: CourseType) {
  switch (type) {
    case CourseType.WSET_LEVEL_1:
      return 1
    case CourseType.WSET_LEVEL_2:
      return 2
    case CourseType.WSET_LEVEL_3:
      return 3
    case CourseType.WSET_LEVEL_4:
      return 4
  }
}

export function getCourseLink(course: CourseDAO) {

  if (course.classDates.length === 0) {
    return `/cursos`
  }
  const courseTypeSlug = course.type.toLowerCase().replaceAll('_', '-')
  const courseDateSlug = format(course.classDates[0], 'yyyy-MMMM', { locale: es })
  return `/cursos/${courseTypeSlug}/${courseDateSlug}`
}

export function getCourseDateSlug(course: CourseDAO) {
  if (course.classDates.length === 0) {
    return '-'
  }
  return format(course.classDates[0], 'yyyy-MMMM', { locale: es })
}

export function completeWithZeros(number: number): string {
  return number.toString().padStart(4, "0")
}
