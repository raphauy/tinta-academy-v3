"use client"

import { createOrUpdateStudentAction, getStudentDAOAction } from "@/app/admin/students/student-actions"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { StudentFormValues, studentSchema } from '@/services/student-services'
import { useUser } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { addMonths, format, subMonths } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

type Props= {
  id?: string
  courseId: string
  notifyStep1Complete: (stepCompleted: number) => void
}

export function StudentForm({ id, courseId, notifyStep1Complete }: Props) {
  const { user } = useUser()
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      city: "",
      zip: "",
      country: "Uruguay",
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)
  const [openCalendar, setOpenCalendar] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const onSubmit = (data: StudentFormValues) => {
    setLoading(true)
    createOrUpdateStudentAction(id ? id : null, data)
    .then(() => {
      toast({ title: "Datos guardados" })
      notifyStep1Complete(1)
    })
    .catch((error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    })
    .finally(() => {
      setLoading(false)
    })
  }

  useEffect(() => {
    if (id) {
      setLoading(true)
      getStudentDAOAction(id).then((data) => {
        if (data) {
          form.reset(data)
        }
        Object.keys(form.getValues()).forEach((key: any) => {
          if (form.getValues(key) === null) {
            form.setValue(key, "")
          }
        })
      })
      .finally(() => setLoading(false))
    }
  }, [form, id])

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i)

  const handleMonthChange = (increment: number) => {
    setCurrentMonth(prevMonth => increment > 0 ? addMonths(prevMonth, 1) : subMonths(prevMonth, 1))
  }
  return (
    <div className="bg-background rounded-md">
      <div>Email: {user?.emailAddresses[0]?.emailAddress}</div>         

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre:</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre del estudiante" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido:</FormLabel>
                <FormControl>
                  <Input placeholder="Apellido del estudiante" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mr-3">Fecha de nacimiento:</FormLabel>
                <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
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
                    <div className="flex items-center justify-center p-2">
                      <Select
                        value={currentMonth.getFullYear().toString()}
                        onValueChange={(value) => setCurrentMonth(new Date(parseInt(value), currentMonth.getMonth()))}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Selecciona el año" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>                      
                    </div>
                    <Calendar
                      mode="single"
                      selected={field.value}
                      locale={es}
                      onSelect={(date) => {
                        field.onChange(date);
                        setOpenCalendar(false)
                      }}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                      month={currentMonth}
                      onMonthChange={setCurrentMonth}
                      className="rounded-md border"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />         
     
     
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono:</FormLabel>
                <FormControl>
                  <Input placeholder="Teléfono del contacto, preferiblemente whatsapp" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección:</FormLabel>
                <FormControl>
                  <Input placeholder="Dirección para recibir materiales" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ciudad:</FormLabel>
                <FormControl>
                  <Input placeholder="Ciudad" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="zip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código postal:</FormLabel>
                <FormControl>
                  <Input placeholder="Código postal" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>País:</FormLabel>
                <FormControl>
                  <Input placeholder="País" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          

          <div className="flex justify-end">
            <Button type="submit" className="w-32">
              {loading && <Loader className="h-4 w-4 animate-spin" />}
              <p>Siguiente</p>
            </Button>
          </div>
        </form>
      </Form>
    </div>     
  )
}
