"use client"

import { getBankDatasDAOAction } from "@/app/admin/bankdatas/bankdata-actions";
import { setOrderTransferenciaBancariaPaymentSentWithBankAction } from "@/app/admin/orders/order-actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { BankDataDAO } from "@/services/bankdata-services";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

  
export const bankSchema = z.object({
	bankId: z.string(),
	comment: z.string().optional(),
})

export type BankFormValues = z.infer<typeof bankSchema>

type FormProps= {
  orderId: string
  notifyStep1Complete: (stepCompleted: number) => void
}

export function MarkAsPaidForm({ orderId, notifyStep1Complete }: FormProps) {

  const form = useForm<BankFormValues>({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      bankId: "",
      comment: ""
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)
  const [bankData, setBankData] = useState<BankDataDAO[] | null>([])

  const onSubmit = async (data: BankFormValues) => {
    if (!data.bankId) {
      toast({ title: "Error", description: "No se puede marcar la orden como pagada sin seleccionar un banco", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      await setOrderTransferenciaBancariaPaymentSentWithBankAction(orderId, data.bankId, data.comment)      
      toast({ title: "Orden marcada como pagada" })
      notifyStep1Complete(3)
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getBankDatasDAOAction()
    .then((data) => {
      if (data) {
        setBankData(data) 
      }
    })
  }, [])

  return (
    <div className="p-4 bg-background rounded-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          <FormField
            control={form.control}
            name="bankId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banco</FormLabel>
                <Select onValueChange={(value) => field.onChange(value)} value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el banco por el que transferiste" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bankData?.map(bank => (
                      <SelectItem key={bank.id} value={bank.id}>{bank.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comentario (Opcional)</FormLabel>
                <Textarea rows={5}  {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
      
          <div className="flex justify-between">
            <Button className="w-32" variant="outline" onClick={() => notifyStep1Complete(1)}>
              Atrás
            </Button>
            <Button type="submit" className="w-32 ml-2">
              {loading && <Loader className="h-4 w-4 mr-2 animate-spin" />}
              <p>Siguiente</p>
            </Button>
          </div>
        </form>
      </Form>
    </div>     
  )
}
