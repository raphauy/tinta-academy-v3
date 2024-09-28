import * as z from "zod"
import { prisma } from "@/lib/db"
import { OrderStatus, PaymentMethod } from "@prisma/client"
import { BankDataDAO, getBankDataDAO } from "./bankdata-services"
import { CourseDAO } from "./course-services"
import { StudentDAO } from "./student-services"

export type OrderDAO = {
	id: string
	number: number
	status: OrderStatus
	email: string
	paymentMethod: PaymentMethod
	amount: number
	currency: string
	createdAt: Date
	updatedAt: Date
	bankData: BankDataDAO | undefined
	bankDataId: string | undefined
	bankTransferComment: string | undefined
	course: CourseDAO
	courseId: string
	student: StudentDAO
	studentId: string
}

export const orderSchema = z.object({
	email: z.string().min(1, "email is required."),	
  paymentMethod: z.nativeEnum(PaymentMethod),
  amount: z.number().min(1, "amount is required."),
  currency: z.string().min(1, "currency is required."),
	courseId: z.string().min(1, "courseId is required."),
	studentId: z.string().min(1, "studentId is required."),
})

export type OrderFormValues = z.infer<typeof orderSchema>


export async function getOrdersDAO() {
  const found = await prisma.order.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as OrderDAO[]
}

export async function getOrderDAO(id: string) {
  const found = await prisma.order.findUnique({
    where: {
      id
    },
  })
  return found as OrderDAO
}
    
export async function createOrder(data: OrderFormValues) {
  const created = await prisma.order.create({
    data: {
      ...data,
      status: "Pending",
    }
  })
  return created
}

export async function updateOrder(id: string, data: OrderFormValues) {
  const updated = await prisma.order.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteOrder(id: string) {
  const deleted = await prisma.order.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullOrdersDAO() {
  const found = await prisma.order.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
			bankData: true,
			course: true,
			student: true,
		}
  })
  return found as OrderDAO[]
}
  
export async function getFullOrderDAO(id: string) {
  const found = await prisma.order.findUnique({
    where: {
      id
    },
    include: {
			bankData: true,
			course: true,
			student: true,
		}
  })
  return found as OrderDAO
}
    

export async function getOrderByStudentAndCourse(studentId: string, courseId: string): Promise<OrderDAO | null> {
  const found = await prisma.order.findFirst({
    where: {
      studentId,
      courseId
    }
  })
  return found as OrderDAO | null
}

export async function updatePaymentMethod(id: string, paymentMethod: PaymentMethod, amount: number, currency: string) {
  const updated = await prisma.order.update({
    where: {
      id
    },
    data: {
      paymentMethod,
      amount,
      currency
    }
  })
  return updated
}

export async function setOrderTransferenciaBancariaPaymentSentWithBank(orderId: string, bankDataId: string, bankTransferComment: string | undefined) {
  console.log("setOrderTransferenciaBancariaPaymentSentWithBank", orderId, bankDataId, bankTransferComment)
  
  
  const order= await getFullOrderDAO(orderId)
  if (!order)
      throw new Error("No se encontro la orden")
  if (order.status !== OrderStatus.Pending) {
      console.log("order is not in status Pending, status:", order.status)
      return order
  } else {
      console.log("setting order to status PaymentSent")
  }

  const updated= await setOrderStatus(orderId, OrderStatus.PaymentSent)
  if (!updated) {
      return null
  }

  const bankData= await getBankDataDAO(bankDataId)
  const comment= bankData.name + (bankTransferComment ? " - " + bankTransferComment : "")

  await prisma.order.update({
      where: {
          id: orderId
      },
      data: {
          bankDataId,
          bankTransferComment: comment
      }
  })

  //await sendNotifyTransferSentEmail(order.id)

  return updated
}

export async function setOrderStatus(orderId: string, status: OrderStatus) {
  const updated = await prisma.order.update({
    where: {
      id: orderId
    },
    data: {
      status
    },
  })
  return updated
}

