import * as z from "zod"
import { prisma } from "@/lib/db"
import { OrderStatus, PaymentMethod } from "@prisma/client"
import { BankDataDAO, getBankDataDAO } from "./bankdata-services"
import { CourseDAO } from "./course-services"
import { StudentDAO } from "./student-services"
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { getCourseTitle } from "@/lib/utils"

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
    },
    include: {
      course: true,
      student: true,
      bankData: true,
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


export async function processOrderMercadoPago(order: OrderDAO) {

  const MP_ACCESS_TOKEN= process.env.MP_ACCESS_TOKEN
  if (!MP_ACCESS_TOKEN) throw new Error("MP_ACCESS_TOKEN no definido")

  const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });

  const APP_URL= process.env.APP_URL
  if (!APP_URL) throw new Error("APP_URL no definido")
  const basePath= APP_URL.endsWith("/") ? APP_URL.slice(0, -1) : APP_URL

	let redirectUrl = basePath + "/cursos/inscripcion/" + order.courseId

  const preference = new Preference(client)

  const preferenceResponse = await preference.create({
    body: {
      items: [{
        id: order.courseId,
        title: getCourseTitle(order.course.type),
        quantity: 1,
        unit_price: order.amount
      }],      
      external_reference: order.id,
      metadata: {
        order_id: order.id,
      },
      back_urls: {
        success: redirectUrl,
        failure: redirectUrl,
        pending: redirectUrl,
      },
    }
  })

  console.log("collector_id", preferenceResponse.collector_id)

  await prisma.order.update({
    where: {
      id: order.id
    },
    data: {
      status: OrderStatus.Pending
    }
  })

  const isProduction= process.env.MP_SANDBOX === "false"
  const initPoint= isProduction ? preferenceResponse.init_point! : preferenceResponse.sandbox_init_point!

  return initPoint
}

export async function processOrderConfirmation(orderId: string) {
  const order = await getFullOrderDAO(orderId)
  const status= order.status
  if (status === OrderStatus.Paid) {
      console.log("Order already paid")
      return null
  }

  const updated= await setOrderStatus(orderId, OrderStatus.Paid)
  if (!updated) {
      return null
  }
  
  // await sendPaymentConfirmationEmail(order.id)
  // await sendNotifyPaymentEmail(order.id)

  return updated
}

export async function setOrderMercadoPagoNotApproved(orderId: string) {
  const order= await getFullOrderDAO(orderId)
  if (!order)
      throw new Error("No se encontró la orden")
  if (order.paymentMethod !== PaymentMethod.MercadoPago) {
      console.log("order is not in payment method MercadoPago, paymentMethod:", order.paymentMethod)
      return
  }
  if (order.status !== OrderStatus.Pending) {
      console.log("order is not in status Pending, status:", order.status)
      return
  } else {
      console.log("setting order to status Rejected")
  }

  const updated= await setOrderStatus(orderId, OrderStatus.Rejected)
  if (!updated) {
      return null
  }

  return updated
}