"use client"

import { Button } from '@/components/ui/button'
import { OrderDAO } from '@/services/order-services'
import { useUser } from '@clerk/nextjs'
import { OrderStatus } from '@prisma/client'
import { Loader } from 'lucide-react'
import { redirect } from 'next/navigation'
import { useState } from 'react'
import { processOrderConfirmationAction } from './order-actions'
import { toast } from '@/hooks/use-toast'

type Props = {
    order: OrderDAO
}
export default function MarkAsPaidButton({ order }: Props) {
    const [loading, setLoading] = useState(false)
    const status= order.status
    const data= useUser()
    const user= data?.user
    const role= user?.publicMetadata?.role

    if (!user) 
        return <div>Debes estar logueado</div>

    if (role !== "admin") 
        return redirect("/unauthorized")

    function handleClick() {
        setLoading(true)
        processOrderConfirmationAction(order.id)
        .then(() => {
            toast({ title: "Compra pagada", description: "Se ha confirmado la recepción del pago de la compra"})
        })
        .catch((error) => {
            toast({ title: "Error", description: error.message})
        })
        .finally(() => {
            setLoading(false)
        })
    }
    if (status === OrderStatus.Paid) {
        return null
    } else if (status === OrderStatus.Pending && order.paymentMethod === "TransferenciaBancaria") {
        return <div className='max-w-[350px] text-center mx-auto'>Hay que esperar a que el cliente marque la transferencia como enviada.</div>
    } else if (status === OrderStatus.Pending && order.paymentMethod === "MercadoPago") {
        return <div className='max-w-[350px] text-center mx-auto'>Esto no debería pasar, hay que chequear en Mercadopago de forma manual. También comunicar al cliente de este inconveniente.</div>
    }

    if (status !== OrderStatus.PaymentSent)
        return null

    return (
        <div className='flex flex-col gap-1'>
            <p className='text-center'>{order.bankTransferComment}</p>
            <Button variant="outline" className="" onClick={handleClick}>
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : "Marcar transferencia recibida"}
            </Button>
        </div>
    )
}
