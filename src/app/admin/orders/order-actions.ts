"use server"
  
import { CouponDAO, getCouponDAO } from "@/services/coupon-services"
import { getCourseDAO } from "@/services/course-services"
import { OrderDAO, OrderFormValues, createOrder, deleteOrder, getFullOrderDAO, getOrderByStudentAndCourse, getOrderDAO, processOrderConfirmation, processOrderMercadoPago, setOrderStatus, setOrderTransferenciaBancariaPaymentSentWithBank, updateOrder, updatePaymentMethod } from "@/services/order-services"
import { getStudentDAO } from "@/services/student-services"
import { OrderStatus, PaymentMethod } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"


export async function getOrderDAOAction(id: string): Promise<OrderDAO | null> {
    return getOrderDAO(id)
}

export async function createOrderAction(courseId: string, studentId: string, paymentMethod: string, couponId: string | undefined): Promise<OrderDAO | null> {       
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

    const coupon= couponId ? await getCouponDAO(couponId) : null
    if (coupon) {
        amount = amount - (amount * coupon.discount) / 100
    }

    const student = await getStudentDAO(studentId)
    if (!student) {
        throw new Error("Student not found")
    }
    let orderId
    let order= await getOrderByStudentAndCourse(studentId, courseId)
    if (!order) {
        const orderValues: OrderFormValues = {
            courseId,
            studentId,
            email: student.email,
            paymentMethod: paymentMethod as PaymentMethod,
            amount,
            currency,
            couponId: coupon?.id
        }
        try {
            const created= await createOrder(orderValues)
            orderId= created.id
        } catch (error) {
            console.log(error)
            throw new Error("Error al crear la orden")
        }
          
    } else {
        const amount = paymentMethod === "MercadoPago" ? course.priceUYU : course.priceUSD
        const currency = paymentMethod === "MercadoPago" ? "UYU" : "USD"
        const updated= await updatePaymentMethod(order.id, paymentMethod as PaymentMethod, amount, currency)
        orderId= updated.id
    }

    if (!orderId) throw new Error("Order not found")

    revalidatePath("/admin/orders")

    order= await getFullOrderDAO(orderId)

    if (order.paymentMethod === PaymentMethod.MercadoPago && order.status === OrderStatus.Pending) {
        let redirectUrl= null
    
        try {
            console.log("processOrder")
            redirectUrl= await processOrderMercadoPago(order)
        } catch (error) {
            console.log(error)
            throw new Error("Error al procesar la orden")
        }
    
        console.log("redirectUrl:", redirectUrl)
        if (redirectUrl) {
            redirect(redirectUrl)        
        } else {
            console.log("redirectUrl is null")            
        }
    }

    return order
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

export async function processOrderConfirmationAction(id: string): Promise<OrderDAO | null> {
    const updated= await processOrderConfirmation(id)

    revalidatePath("/[storeSlug]/orders", "page")

    return updated as OrderDAO
}