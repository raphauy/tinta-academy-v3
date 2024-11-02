'use client'

import { getCourseDAOAction } from "@/app/admin/courses/course-actions"
import { createOrderAction } from "@/app/admin/orders/order-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { BankDataDAO } from "@/services/bankdata-services"
import { CouponDAO } from "@/services/coupon-services"
import { CourseDAO } from "@/services/course-services"
import { OrderDAO } from "@/services/order-services"
import { useUser } from "@clerk/nextjs"
import { CourseType, PaymentMethod } from "@prisma/client"
import { CheckIcon, Loader } from 'lucide-react'
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { useEffect, useState } from 'react'
import { MarkAsPaidForm } from "./bank-form-and-dialog"
import MpCallback from "./mp-callback"
import Step2Box from "./step-2-box"
import { StudentForm } from "./student-forms"

type Props = {
  bankData: BankDataDAO[]
  initialOrder: OrderDAO | null
}

export function MultiStepForm({ bankData, initialOrder }: Props) {
  const [course, setCourse] = useState<CourseDAO | null>(null)
  const [coupon, setCoupon] = useState<CouponDAO | null>(null)
  const [studentId, setStudentId] = useState<string | undefined>(undefined)
  const [order, setOrder] = useState<OrderDAO | null>(initialOrder)
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">(order?.paymentMethod || "")
  const [mpStatus, setMpStatus] = useState<string | null>(null)

  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const params= useParams()
  const courseId = params.courseId as string

  const clerkData = useUser()

  useEffect(() => {
    const mpStatusParam = searchParams.get('status')
    if (mpStatusParam) {
      setMpStatus(mpStatusParam)
      setStep(4)
    }
  }, [searchParams])

  useEffect(() => {
    if (!courseId) return

    setLoading(true)
    getCourseDAOAction(courseId)
    .then(data => {
      setCourse(data)
      if (data?.priceUSD === 0) {
        setPaymentMethod("Gratuito")
      }
    })
    .finally(() => setLoading(false))
  }, [courseId])

  useEffect(() => {
    console.log("loading studentId")
    clerkData.user?.reload()
    const newStudentId = clerkData.user?.publicMetadata.studentId as string
    console.log("setting studentId to", newStudentId)
    if (newStudentId) {
      setStudentId(newStudentId)
    }
  }, [clerkData])

  const handleRadioChange = (value: string) => {
    setPaymentMethod(value as PaymentMethod)
  }

  function createOrder() {
    if (!course || !studentId || !paymentMethod) {
      console.log("Course", course)
      console.log("StudentId", studentId)
      console.log("PaymentMethod", paymentMethod)
      toast({ title: "Error", description: "No se puede crear la orden de pago", variant: "destructive" })
      return
    }
    console.log("Creating order with studentId", studentId)
    setLoading(true)
    createOrderAction(course.id, studentId, paymentMethod, coupon?.id)
    .then((order) => {
      setOrder(order)      
      setStep(3)
    })
    .catch((error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    })
    .finally(() => {
      setLoading(false)
    })
  }

  const handleNext = () => {
    if (step === 2) {
      createOrder()
    } else {
      setStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    setStep(prev => prev - 1)
  }

  function notifyStepComplete(stepCompleted: number) {
    setStep(stepCompleted + 1)
  }

  const steps = [
    { number: 1, title: 'Datos' },
    { number: 2, title: 'Pago' },
    { number: 3, title: 'Confirmación' },
  ]

  if (order?.status === "Paid" || order?.status === "PaymentSent" || (step === 3 && paymentMethod === "Gratuito")) {
    return (
      <div className="text-center space-y-4">
        <CheckIcon className="w-16 h-16 mx-auto text-green-500" />
        <p className="text-xl font-semibold pb-10">¡Gracias por tu inscripción!</p>
        <Button>
          <Link href="/student">
            Ir al Panel de Estudiante
          </Link>
        </Button>
      </div>
    )
  }

  const courseIsFree= course && course.priceUSD && course.priceUSD > 0 ? false : true
  const courseLabel= course?.type === CourseType.TALLER ? "El Taller" : course?.type === CourseType.CATA ? "La Cata" : "El Curso"

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{course && course.title}</CardTitle>
        <CardDescription>Completa los siguientes pasos para inscribirte en el curso</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-8 mx-4">
          <div className="relative flex justify-between items-center">
            <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-300 z-0" />
            <div 
              className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-300 ease-in-out z-0" 
              style={{ width: `${((Math.min(steps.length, 3) - 1) / (steps.length -1)) * 100}%` }}
            />
            {steps.map((s, i) => (
              <div key={s.number} className="flex flex-col items-center z-10">
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                    step > s.number 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : step === s.number
                        ? 'bg-background border-primary text-primary' 
                        : 'bg-background border-gray-300 text-gray-500'
                  }`}>
                    {step > s.number ? (
                      <CheckIcon className="w-6 h-6 text-primary-foreground" />
                    ) : (
                      s.number
                    )}
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <span className="text-sm">{s.title}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          {step === 1 && (
            <div className="space-y-4">
              { courseId && <StudentForm courseId={courseId} id={studentId} notifyStep1Complete={notifyStepComplete}/> }
            </div>
          )}
          {step === 2 && course && !courseIsFree && (
            <Step2Box initialPaymentMethod={paymentMethod} handleRadioChange={handleRadioChange} bankData={bankData} course={course} onCouponApplied={setCoupon} />
          )}
          {step === 2 && course && courseIsFree && (
            <p className="text-center font-bold border p-4 rounded-md">{courseLabel} es gratis</p>
          )}
          {step === 3 && order && paymentMethod === "TransferenciaBancaria" && (
            <MarkAsPaidForm orderId={order.id} notifyStep1Complete={notifyStepComplete} />
          )}
          {step === 3 && order && paymentMethod === "MercadoPago" && (
            <p className="text-center">Redicreccionando a MercadoPago</p>            
          )}
          {step === 4 && order && paymentMethod === "MercadoPago" && mpStatus &&  (
            <MpCallback status={mpStatus} />
          )}
          {step === 4 && paymentMethod === "TransferenciaBancaria" && (
            <div className="text-center space-y-4">
              <CheckIcon className="w-16 h-16 mx-auto text-green-500" />
              <p className="text-xl font-semibold">¡Gracias por tu inscripción!</p>
              <p>Hemos recibido tus datos correctamente.</p>
              <p>En cuanto recibamos el pago, te enviaremos un correo con la confirmación de la inscripción.</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="w-full flex justify-between">
          {(step === 2 || (step === 3 && paymentMethod === "MercadoPago")) && (
            <Button className="w-32" variant="outline" onClick={handleBack}>
              Atrás
            </Button>
          )}
          {step <= 3 ? (
            <Button 
              className={cn("w-32", (step === 1 || (step === 3 && paymentMethod === "TransferenciaBancaria")) && "hidden")}
              onClick={handleNext} 
              disabled={
                ((step === 2 && !paymentMethod) && !courseIsFree)
                
            }>
              {loading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
              <p>Siguiente</p>
            </Button>
          ) : (
            <Button className="w-full mt-10">
              <Link href="/student">
                Ir al Panel de Estudiante
              </Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}