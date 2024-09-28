'use client'

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { DollarSign, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

type BankData = {
  id: string
  name: string
  info: string
}

type BankDataListProps = {
  bankData: BankData[]
  amount: number
}

export function BankDataList({ bankData, amount }: BankDataListProps) {

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-6">Datos Bancarios</CardTitle>
        <div className="bg-blue-100 p-4 rounded-md my-6 flex items-center">
          <DollarSign className="text-blue-500 mr-2 h-6 w-6" aria-hidden="true" />
          <p className="text-lg font-semibold text-blue-800 flex items-center">
            Monto a transferir: <span className="text-2xl ml-2">{amount} USD</span>
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mt-2 mb-4">
          Puedes enviar el dinero a cualquiera de estos bancos, una vez enviado puedes pasar al siguiente paso y confirmar el envío.
        </p>
        <ul className="space-y-6">
          {bankData.map((bank) => (
            <li key={bank.id} className="border-b pb-4 last:border-b-0 last:pb-0">
              <h3 className="text-xl font-semibold mb-2">{bank.name}</h3>
              <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-100 p-3 rounded">
                {bank.info}
              </pre>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Alert variant="default" className="mt-6">
          <Clock className="h-4 w-4" />
          <AlertDescription>
            <strong>Nota importante:</strong> Tu lugar está reservado, tienes 1 hora para confirmar que realizaste la transferencia bancaria en el siguiente paso y asegurar tu lugar en el curso.
          </AlertDescription>
        </Alert>
      </CardFooter>
    </Card>
  )
}