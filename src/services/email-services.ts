import NotifyTransferEmail from "@/components/emails/notify-transfer";
import { completeWithZeros, getCourseTitle } from "@/lib/utils";
import { Resend } from "resend";
import { getFullOrderDAO } from "./order-services";

export async function sendNotifyTransferSentEmail(orderId: string) {

  const order = await getFullOrderDAO(orderId)

  const from= "academy@tinta.wine"
  const replyTo= "academy@tinta.wine"
  let to= "gabi@tinta.wine"

  const orderNumber= `#${completeWithZeros(order.number)}`
  const subject = "Transferencia enviada, orden: " + orderNumber

  const courseName= getCourseTitle(order.course.type)

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from,
    to,
    bcc: process.env.BCC_ADMIN_EMAIL ? process.env.BCC_ADMIN_EMAIL : "",
    replyTo,
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