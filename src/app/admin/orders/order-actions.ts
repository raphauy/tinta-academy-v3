"use server"
  
import { getCourseDAO } from "@/services/course-services"
import { OrderDAO, OrderFormValues, createOrder, deleteOrder, getOrderByStudentAndCourse, getOrderDAO, setOrderStatus, setOrderTransferenciaBancariaPaymentSentWithBank, updateOrder, updatePaymentMethod } from "@/services/order-services"
import { getStudentDAO } from "@/services/student-services"
import { OrderStatus, PaymentMethod } from "@prisma/client"
import { revalidatePath } from "next/cache"


export async function getOrderDAOAction(id: string): Promise<OrderDAO | null> {
    return getOrderDAO(id)
}

export async function createOrderAction(courseId: string, studentId: string, paymentMethod: string): Promise<OrderDAO | null> {       
    const course = await getCourseDAO(courseId)
    if (!course) {
        throw new Error("Course not found")
    }
    let amount = course.priceUSD
    let currency = "USD"
    if (paymentMethod === "MercadoPago") {
        amount = course.priceUYU
        currency = "UYU"
    }
    const student = await getStudentDAO(studentId)
    if (!student) {
        throw new Error("Student not found")
    }
    const order = await getOrderByStudentAndCourse(studentId, courseId)
    if (!order) {
        const orderValues: OrderFormValues = {
            courseId,
            studentId,
            email: student.email,
            paymentMethod: paymentMethod as PaymentMethod,
            amount,
            currency
        }
        const created= await createOrder(orderValues)
        revalidatePath("/admin/orders")
        return created as OrderDAO
    } else {
        const amount = paymentMethod === "MercadoPago" ? course.priceUYU : course.priceUSD
        const currency = paymentMethod === "MercadoPago" ? "UYU" : "USD"
        const updated = await updatePaymentMethod(order.id, paymentMethod as PaymentMethod, amount, currency)
        revalidatePath("/admin/orders")
        return updated as OrderDAO
    }
}

export async function updateOrderAction(id: string, data: OrderFormValues): Promise<OrderDAO | null> {    
    const updated= await updateOrder(id, data)

    revalidatePath("/admin/orders")

    return updated as OrderDAO
}

export async function deleteOrderAction(id: string): Promise<OrderDAO | null> {    
    const deleted= await deleteOrder(id)

    revalidatePath("/admin/orders")

    return deleted as OrderDAO
}

export async function setOrderTransferenciaBancariaPaymentSentWithBankAction(id: string, bankId: string, comment: string | undefined): Promise<OrderDAO | null> {   
    const updated= await setOrderTransferenciaBancariaPaymentSentWithBank(id, bankId, comment)

    revalidatePath("/admin/orders")

    return updated as OrderDAO
}

export async function setOrderStatusAction(id: string, status: OrderStatus): Promise<OrderDAO | null> {   
    const updated= await setOrderStatus(id, status)

    revalidatePath("/admin/orders")

    return updated as OrderDAO
}