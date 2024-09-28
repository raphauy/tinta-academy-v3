import NotifyTransferEmail from "@/components/emails/notify-transfer";
import { completeWithZeros, getCourseTitle } from "@/lib/utils";
import { Resend } from "resend";
import { getFullOrderDAO } from "./order-services";
import WelcomeToTintaAcademy from "@/components/emails/payment-confirmation";
import NotifyPaymentEmail from "@/components/emails/notify-payment";

export async function sendNotifyTransferSentEmail(orderId: string) {

  const order = await getFullOrderDAO(orderId)

  const from= process.env.DEFAULT_EMAIL_FROM!
  const to= process.env.DEFAULT_EMAIL_TO!
  const bcc= process.env.DEFAULT_EMAIL_BCC!

  const orderNumber= `#${completeWithZeros(order.number)}`
  const subject = "Transferencia enviada, orden: " + orderNumber

  const courseName= getCourseTitle(order.course.type)

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from,
    to,
    bcc,
    replyTo: "academy@tinta.wine",
    subject,
    react: NotifyTransferEmail({ 
      buyerName: order.student.firstName + " " + order.student.lastName,
      buyerEmail: order.email,
      courseName,
      paymentAmount: order.amount,
      paymentCurrency: order.currency,
      paymentMethod: order.paymentMethod,
      comment: order.bankTransferComment || "",
      orderNumber,
    }),
  });

  if (error) {
    console.log("Error sending test email")    
    console.log("error.name:", error.name)    
    console.log("error.message:", error.message)
    return false
  } else {
    console.log("email result: ", data)
  }

  return true
}

export async function sendWelcomeToTintaAcademy(orderId: string, testEmailTo?: string) {
  const order = await getFullOrderDAO(orderId)

  const from= process.env.DEFAULT_EMAIL_FROM!
  const to= order.email
  const bcc= process.env.DEFAULT_EMAIL_BCC!

  let subject = "¡Bienvenido/a a Tinta Academy! 🌟🍇"

  const orderNumber= `#${completeWithZeros(order.number)}`

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from,
    to,
    bcc,
    replyTo: "academy@tinta.wine",
    subject,
    react: WelcomeToTintaAcademy({ 
      buyerName: order.student.firstName,
      courseName: getCourseTitle(order.course.type)
    }),
  });

  if (error) {
    console.log("Error sending test email")    
    console.log("error.name:", error.name)    
    console.log("error.message:", error.message)
    return false
  } else {
    console.log("email result: ", data)
  }

  return true
}

export async function sendNotifyPaymentEmail(orderId: string) {

  const order = await getFullOrderDAO(orderId)

  const from= process.env.DEFAULT_EMAIL_FROM!
  const to= process.env.DEFAULT_EMAIL_TO!
  const bcc= process.env.DEFAULT_EMAIL_BCC!

  const orderNumber= `#${completeWithZeros(order.number)}`

  const subject = "Pago recibido, orden: " + orderNumber

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from,
    to,
    bcc,
    replyTo: "academy@tinta.wine",
    subject,
    react: NotifyPaymentEmail({ 
      buyerName: order.student.firstName + " " + order.student.lastName,
      buyerEmail: order.email,
      paymentAmount: order.amount,
      paymentMethod: order.paymentMethod,
      orderNumber,
    }),
  })

  if (error) {
    console.log("Error sending test email")    
    console.log("error.name:", error.name)    
    console.log("error.message:", error.message)
    return false
  } else {
    console.log("email result: ", data)
  }

  return true
} 