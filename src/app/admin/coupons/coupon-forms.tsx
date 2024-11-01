"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { CouponFormValues, couponSchema } from '@/services/coupon-services'
import { CourseDAO } from "@/services/course-services"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { createOrUpdateCouponAction, deleteCouponAction, getActiveCoursesAction, getCouponDAOAction } from "./coupon-actions"

type Props= {
  id?: string
  closeDialog: () => void
}

export function CouponForm({ id, closeDialog }: Props) {
  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      maxUses: "1",
      email: "",
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)
  const [openCalendar, setOpenCalendar] = useState(false)
  const [activeCourses, setActiveCourses] = useState<CourseDAO[]>([])

  const onSubmit = async (data: CouponFormValues) => {
    setLoading(true)
    try {
      await createOrUpdateCouponAction(id ? id : null, data)
      toast({ title: id ? "Coupon updated" : "Coupon created" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getActiveCoursesAction()
    .then((data) => {
      setActiveCourses(data)
    })
  }, [])

  useEffect(() => {
    if (id) {
      getCouponDAOAction(id).then((data) => {
        if (data) {
          form.setValue("code", data.code)
          form.setValue("discount", data.discount.toString())
          form.setValue("maxUses", data.maxUses.toString())
          data.email && form.setValue("email", data.email)
          data.expiresAt && form.setValue("expiresAt", data.expiresAt)
          data.courseId && form.setValue("courseId", data.courseId)
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
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input placeholder="Código del cupón" {...field} className="uppercase"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Porcentaje de descuento</FormLabel>
                <FormControl>
                  <Input placeholder="Descuento del cupón" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="maxUses"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximo de usos</FormLabel>
                <FormControl>
                  <Input placeholder="Máximo de usos del cupón" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="expiresAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mr-3">Fecha de expiración (opcional, sin fecha no expira):</FormLabel>
                <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: es })
                        ) : (
                          <span>Selecciona la fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      onSelect={(date) => {
                        field.onChange(date);
                        setOpenCalendar(false)
                      }}
                      disabled={(date) => date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Email del único estudiante que puede usar el cupón" {...field} />
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
                <FormLabel className="mr-3">Curso (opcional):</FormLabel>
                <Select onValueChange={(value) => field.onChange(value)} value={field.value}
                >
                <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccione aquí" />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {activeCourses.map(course => (
                    <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>  
                    ))}
                </SelectContent>
                </Select>
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

type DeleteProps= {
  id: string
  closeDialog: () => void
}

export function DeleteCouponForm({ id, closeDialog }: DeleteProps) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteCouponAction(id)
    .then(() => {
      toast({title: "Coupon deleted" })
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

