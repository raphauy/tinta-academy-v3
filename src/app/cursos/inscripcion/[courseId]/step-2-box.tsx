"use client"

import { getCouponByCodeAction } from "@/app/admin/coupons/coupon-actions"
import { BankDataList } from "@/components/bank-data-list"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { BankDataDAO } from "@/services/bankdata-services"
import { CouponDAO } from "@/services/coupon-services"
import { CourseDAO } from "@/services/course-services"
import { useUser } from "@clerk/nextjs"
import { AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"
import DiscountCoupon from "./discount-coupon"

type Step2BoxProps = {
    initialPaymentMethod: string
    handleRadioChange: (value: string) => void
    bankData: BankDataDAO[]
    course: CourseDAO
    onCouponApplied: (coupon: CouponDAO | null) => void
}

export default function Step2Box({ initialPaymentMethod, handleRadioChange, bankData, course, onCouponApplied }: Step2BoxProps) {
    const { user }= useUser()
    const loggedEmail= user?.emailAddresses[0].emailAddress

    const [amount, setAmount] = useState(course.priceUSD)
    const [paymentMethod, setPaymentMethod] = useState(initialPaymentMethod)
    const [coupon, setCoupon] = useState<CouponDAO | null>(null)



    function handleInternalRadioChange(value: string) {
        setPaymentMethod(value)
        handleRadioChange(value)
    }

    async function checkCoupon(couponCode: string) {
        if (!loggedEmail) {
            toast({ title: "Error", description: "Debes estar logueado para aplicar un cupón", variant: "destructive" })
            return
        }
        const coupon= await getCouponByCodeAction(couponCode, course.id, loggedEmail)
        if (coupon) {
            setCoupon(coupon)
            setAmount(course.priceUSD - (course.priceUSD * coupon.discount) / 100)
            onCouponApplied(coupon)
        } else {
            toast({ title: "Error", description: "Cupón inválido", variant: "destructive" })
            setCoupon(null)
        }
    }

    return (
        <div className="space-y-10">
            <DiscountCoupon priceUSD={course.priceUSD} coupon={coupon} onApplyCoupon={checkCoupon} />
            <RadioGroup 
                onValueChange={handleInternalRadioChange}
                defaultValue={paymentMethod}
                className="space-y-2"
                >
                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted">
                    <RadioGroupItem value="MercadoPago" id="MercadoPago" />
                    <Label htmlFor="MercadoPago" className="flex-grow cursor-pointer">MercadoPago</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted">
                    <RadioGroupItem value="TransferenciaBancaria" id="TransferenciaBancaria" />
                    <Label htmlFor="TransferenciaBancaria" className="flex-grow cursor-pointer">Transferencia bancaria</Label>
                </div>
            </RadioGroup>

            {paymentMethod === "TransferenciaBancaria" && (
                <BankDataList bankData={bankData} amount={amount} />
            )}

            {paymentMethod === "MercadoPago" && (
                <Alert variant="default" className="mt-6 flex flex-col">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="mt-1">
                        Al hacer click en el botón Siguiente, se te redigirá a MercadoPago para completar el pago.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    )
}