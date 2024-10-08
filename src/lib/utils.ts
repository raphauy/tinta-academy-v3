import { CourseDAO } from "@/services/course-services"
import { CourseType, OrderStatus, PaymentMethod } from "@prisma/client"
import { clsx, type ClassValue } from "clsx"
import { format, isThisWeek, isToday, isYesterday, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCourseTypeLabel(type: CourseType | string) {
  switch (type) {
    case CourseType.WSET_NIVEL_1:
      return "WSET Nivel 1"
    case CourseType.WSET_NIVEL_2:
      return "WSET Nivel 2"
    case CourseType.WSET_NIVEL_3:
      return "WSET Nivel 3"
    default:
      return "Otro"
  }
}

export function getCourseTitle(type: CourseType) {
  switch (type) {
    case CourseType.WSET_NIVEL_1:
      return "WSET Nivel 1 Cualificación en Vinos"
    case CourseType.WSET_NIVEL_2:
      return "WSET Nivel 2 Cualificación en Vinos"
    case CourseType.WSET_NIVEL_3:
      return "WSET Nivel 3 Cualificación en Vinos"
    default:
      return "Otro"
  }
}

export function getLevel(type: CourseType) {
  switch (type) {
    case CourseType.WSET_NIVEL_1:
      return 1
    case CourseType.WSET_NIVEL_2:
      return 2
    case CourseType.WSET_NIVEL_3:
      return 3
  }
}

export function getCourseLink(course: CourseDAO) {

  const courseTypeSlug = course.type.toLowerCase().replaceAll('_', '-')
  const courseDateSlug = course.classDates[0] ? format(course.classDates[0], 'yyyy-MMMM', { locale: es }) : "sin-definir"
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


export function getLabel(status: OrderStatus, paymentMethod: PaymentMethod) {
  switch (status) {
    case OrderStatus.Created:
      return "Creada"
    case OrderStatus.Pending:
      if (paymentMethod === PaymentMethod.TransferenciaBancaria)
        return "Transferencia Pendiente"
      else if (paymentMethod === PaymentMethod.MercadoPago)
        return "Confirmación MP pendiente"
      else
        return "Pago Pendiente"
    case OrderStatus.PaymentSent:
      return "Transferencia enviada"
    case OrderStatus.Paid:
      return "Pagada"
    case OrderStatus.Rejected:
      return "Rechazada"
    case OrderStatus.Refunded:
      return "Reembolsada"
    case OrderStatus.Cancelled:
      return "Cancelada"
    default:
      return "Sin estado"
  }
  
}

export function formatWhatsAppStyle(date: Date | string): string {
  let parsedDate = typeof date === 'string' ? parseISO(date) : date;

  // todo timezone
  
  if (isToday(parsedDate)) {
    // return "hoy"
    return format(parsedDate, 'HH:mm')
  } else if (isYesterday(parsedDate)) {
    return 'Ayer'
  } else if (isThisWeek(parsedDate)) {
    return format(parsedDate, 'eeee', { locale: es })
  } else {
    return format(parsedDate, 'dd/MM/yyyy')
  }
}

export function getOrderStatusLabel(orderStatus: OrderStatus | undefined) {
  if (!orderStatus) {
    return "Sin estado"
  }
  switch (orderStatus) {
    case OrderStatus.Created:
      return "Creada"
    case OrderStatus.Pending:
      return "Pendiente"
    case OrderStatus.PaymentSent:
      return "Transferencia enviada"
    case OrderStatus.Paid:
      return "Pagado"
    case OrderStatus.Rejected:
      return "Rechazado"
    case OrderStatus.Refunded:
      return "Reembolsado"
    case OrderStatus.Cancelled:
      return "Cancelado"
    default:
      return "Sin estado"
  }
}