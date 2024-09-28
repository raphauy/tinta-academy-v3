"use client"

import { BankDataList } from "@/components/bank-data-list"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { BankDataDAO } from "@/services/bankdata-services"
import { CourseDAO } from "@/services/course-services"
import { AlertCircle } from "lucide-react"
import { useState } from "react"

type Step2BoxProps = {
    initialPaymentMethod: string
    handleRadioChange: (value: string) => void
    bankData: BankDataDAO[]
    course: CourseDAO
}

export default function Step2Box({ initialPaymentMethod, handleRadioChange, bankData, course }: Step2BoxProps) {
    const [paymentMethod, setPaymentMethod] = useState(initialPaymentMethod)

    function handleInternalRadioChange(value: string) {
        setPaymentMethod(value)
        handleRadioChange(value)
    }

    return (
        <div className="space-y-10">
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
                <BankDataList bankData={bankData} amount={course.priceUSD} />
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