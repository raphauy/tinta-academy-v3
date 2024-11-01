"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { OrderFormValues, orderSchema } from '@/services/order-services'
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { createOrderAction, deleteOrderAction, getOrderDAOAction, updateOrderAction } from "./order-actions"

type Props= {
  id?: string
  closeDialog: () => void
}

export function OrderForm({ id, closeDialog }: Props) {
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {},
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: OrderFormValues) => {
    setLoading(true)
    try {
      if (id) {
        await updateOrderAction(id, data)
      } else {
        await createOrderAction(data.courseId, data.studentId, data.paymentMethod, data.couponId)
      }
      toast({ title: id ? "Order updated" : "Order created" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getOrderDAOAction(id).then((data) => {
        if (data) {
          form.setValue("couponId", data.couponId || undefined)
          form.setValue("email", data.email)
          form.setValue("paymentMethod", data.paymentMethod)
          form.setValue("courseId", data.courseId)
          form.setValue("studentId", data.studentId)          
        }
        Object.keys(form.getValues()).forEach((key: any) => {
          if (form.getValues(key) === null) {
            form.setValue(key, "")
          }
        })
      })
    }
  }, [form, id])

  return (
    <div className="p-4 bg-white rounded-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Order's email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PaymentMethod</FormLabel>
                <FormControl>
                  <Input placeholder="Order's paymentMethod" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="courseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CourseId</FormLabel>
                <FormControl>
                  <Input placeholder="Order's courseId" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>StudentId</FormLabel>
                <FormControl>
                  <Input placeholder="Order's studentId" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          

        <div className="flex justify-end">
            <Button onClick={() => closeDialog()} type="button" variant={"secondary"} className="w-32">Cancel</Button>
            <Button type="submit" className="w-32 ml-2">
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>Save</p>}
            </Button>
          </div>
        </form>
      </Form>
    </div>     
  )
}

export function DeleteOrderForm({ id, closeDialog }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteOrderAction(id)
    .then(() => {
      toast({title: "Order deleted" })
    })
    .catch((error) => {
      toast({title: "Error", description: error.message, variant: "destructive"})
    })
    .finally(() => {
      setLoading(false)
      closeDialog && closeDialog()
    })
  }
  
  return (
    <div>
      <Button onClick={() => closeDialog && closeDialog()} type="button" variant={"secondary"} className="w-32">Cancel</Button>
      <Button onClick={handleDelete} variant="destructive" className="w-32 ml-2 gap-1">
        { loading && <Loader className="h-4 w-4 animate-spin" /> }
        Delete  
      </Button>
    </div>
  )
}

