import { Button } from "@/components/ui/button"
import { CheckIcon, XCircleIcon } from "lucide-react"
import Link from "next/link"

type Props = {
    status: string
}
export default function MpCallback({ status } : Props) {
    
    if (status === "approved") {
        return (
            <div className="text-center space-y-4">
                <CheckIcon className="w-16 h-16 mx-auto text-green-500" />
                <p className="text-xl font-semibold">¡Gracias por tu inscripción!</p>
                <p>Hemos recibido tus datos correctamente.</p>
                <p>Hemos recibido la confirmación de tu pago en Mercadopago.</p>
                <p>Felicidades, ya formas parte de nuestro curso.</p>

                <Button>
                    <Link href="/student">
                        Ir al Panel de Estudiante
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="text-center space-y-4">
            <XCircleIcon className="w-16 h-16 mx-auto text-red-500" />
            <p className="text-xl font-semibold">¡Ups! Algo salió mal.</p>
            <p>Hemos recibido un error por parte de MercadoPago.</p>
        </div>
    )
}