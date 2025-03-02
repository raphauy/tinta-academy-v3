"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"
import { deleteCourseAction, createOrUpdateCourseAction, getCourseDAOAction, setClassDatesAndTimeAction, checkSlugAction } from "./course-actions"
import { courseSchema, CourseFormValues } from '@/services/course-services'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CalendarIcon, Loader, TrashIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn, generateSlug, getCourseTypeLabel } from "@/lib/utils"
import { format, parse } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { es } from "date-fns/locale"
import { CourseStatus, CourseType } from "@prisma/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getEducatorsAction } from "../educators/educator-actions"
import { Textarea } from "@/components/ui/textarea"

const types= Object.values(CourseType)
export type EducatorSelect = {
  id: string
  name: string
}

type Props= {
  id?: string
  closeDialog: () => void
}

export function CourseForm({ id, closeDialog }: Props) {
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      type: CourseType.WSET_NIVEL_1,
      status: CourseStatus.Anunciado,
      title: "",
      slug: "",
      totalDuration: "6",
      classDuration: "2",
      location: "",
      maxCapacity: "15",
      educatorId: "cm1htv3xf0000afkwt4cn4o98",
      description: "",
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)
  const [examDateOpenCalendar, setExamDateOpenCalendar] = useState(false)
  const [registrationDeadlineOpenCalendar, setRegistrationDeadlineOpenCalendar] = useState(false)
  const [educators, setEducators] = useState<EducatorSelect[]>([])

  const type= form.watch("type")

  useEffect(() => {
    getEducatorsAction()
    .then((data) => {
      setEducators(data.map(educator => ({ id: educator.id, name: educator.name })))
    })
  }, [])

  const onSubmit = async (data: CourseFormValues) => {
    setLoading(true)
    try {
      const exists= await checkSlugAction(data.slug, id)
      if (exists) {
        toast({ title: "Error", description: "Ya existe el slug " + data.slug, variant: "destructive" })
        return
      }
      await createOrUpdateCourseAction(id ? id : null, data)
      toast({ title: id ? "Course updated" : "Course created" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getCourseDAOAction(id).then((data) => {
        if (data) {
          form.setValue("type", data.type)
          form.setValue("status", data.status)
          form.setValue("title", data.title)
          form.setValue("slug", data.slug)
          form.setValue("priceUSD", data.priceUSD.toString())
          form.setValue("priceUYU", data.priceUYU.toString())
          data.examDate && form.setValue("examDate", data.examDate)
          data.registrationDeadline && form.setValue("registrationDeadline", data.registrationDeadline)
          form.setValue("totalDuration", data.totalDuration.toString())
          form.setValue("classDuration", data.classDuration.toString())
          data.location && form.setValue("location", data.location)
          form.setValue("maxCapacity", data.maxCapacity.toString())
          form.setValue("educatorId", data.educatorId)
          data.description && form.setValue("description", data.description)
        }
        Object.keys(form.getValues()).forEach((key: any) => {
          if (form.getValues(key) === null) {
            form.setValue(key, "")
          }
        })
      })
    }
  }, [form, id])

  function generateSlugFromTitle() {
    const title= form.getValues("title")
    let slug= generateSlug(title)
    checkSlugAction(slug, id)
    .then((exists) => {
      if (exists) {
        slug= slug + "-1"
      }
      form.setValue("slug", slug)
    })
  }

  return (
    <div className="p-4 bg-white rounded-md">
      <p>Tipo: {type}</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          <div className="w-full grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Tipo de curso:</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value)} value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {types.map(type => (
                        <SelectItem key={type} value={type}>{getCourseTypeLabel(type)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Estado:</FormLabel>
                <Select onValueChange={(value) => field.onChange(value)} value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(CourseStatus).map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
              )}
              />

          </div>

          <div className="w-full grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título:</FormLabel>
                  <FormControl>
                    <Input placeholder="Título" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug:</FormLabel>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input placeholder="slug" {...field} />
                      </FormControl>
                      <Button onClick={generateSlugFromTitle} type="button">Generar slug</Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          

          <div className="w-full grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="totalDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duración total en horas:</FormLabel>
                  <FormControl>
                    <Input placeholder="6" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="classDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duración de cada clase en horas:</FormLabel>
                  <FormControl>
                    <Input placeholder="2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />            
                    
          </div>          
          
          
      
          <div className="w-full grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="priceUSD"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio del curso en USD:</FormLabel>
                  <FormControl>
                    <Input placeholder="450" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />            
        
            <FormField
              control={form.control}
              name="priceUYU"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio del curso en UYU (pesos uruguayos):</FormLabel>
                  <FormControl>
                    <Input placeholder="18000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
      
          <div className="w-full grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="maxCapacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacidad máxima de estudiantes:</FormLabel>
                  <FormControl>
                    <Input placeholder="15" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />        
          
            <FormField
              control={form.control}
              name="educatorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Educador:</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value)} value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un educador" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {educators.map(educator => (
                        <SelectItem key={educator.id} value={educator.id}>{educator.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lugar donde se imparte el curso:</FormLabel>
                  <FormControl>
                    <Input placeholder="Hotel Costanero MGallery, Montevideo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          {type.startsWith("WSET") && (
          <FormField
            control={form.control}
            name="examDate"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Fecha de examen:</FormLabel>
                  <Popover open={examDateOpenCalendar} onOpenChange={setExamDateOpenCalendar}>
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
                          setExamDateOpenCalendar(false)
                        }}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
          )}
          
      
          <FormField
            control={form.control}
            name="registrationDeadline"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                <FormLabel>Fecha límite de inscripción:</FormLabel>
                <Popover open={registrationDeadlineOpenCalendar} onOpenChange={setRegistrationDeadlineOpenCalendar}>
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
                          setRegistrationDeadlineOpenCalendar(false)
                        }}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {!type.startsWith("WSET") && (
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción corta:</FormLabel>
                <FormControl>
                  <Textarea rows={10} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          )}

            

        <div className="flex justify-end">
            <Button onClick={() => closeDialog()} type="button" variant={"secondary"} className="w-32">Cancelar</Button>
            <Button type="submit" className="w-32 ml-2">
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>Guardar</p>}
            </Button>
          </div>
        </form>
      </Form>
    </div>     
  )
}

type DeleteCourseFormProps = {
  id: string
  closeDialog: () => void
}

export function DeleteCourseForm({ id, closeDialog }: DeleteCourseFormProps) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteCourseAction(id)
    .then(() => {
      toast({title: "Course deleted" })
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
      <Button onClick={() => closeDialog && closeDialog()} type="button" variant={"secondary"} className="w-32">Cancelar</Button>
      <Button onClick={handleDelete} variant="destructive" className="w-32 ml-2 gap-1">
        { loading && <Loader className="h-4 w-4 animate-spin" /> }
        Eliminar  
      </Button>
    </div>
  )
}


type AddDatesFormProps = {
  id: string
  initialDates: Date[]
  initialStartTime: string
  closeDialog: () => void
}

export function AddDatesForm({ id, initialDates, initialStartTime, closeDialog }: AddDatesFormProps) {
  const [loading, setLoading] = useState(false)
  const [dates, setDates] = useState<Date[]>(initialDates)
  const [openCalendar, setOpenCalendar] = useState(false)
  const [value, setValue] = useState<Date | undefined>(undefined)
  const [startTime, setStartTime] = useState(initialStartTime)

  function handleSubmit() {
    setLoading(true)
    setClassDatesAndTimeAction(id, dates, startTime)
    .then(() => {
      toast({title: "Fechas actualizadas"})
      closeDialog && closeDialog()
    })
    .catch((error) => {
      toast({title: "Error", description: error.message, variant: "destructive"})
    })
    .finally(() => {
      setLoading(false)
    })
  }

  function handleDateSelect(date: Date | undefined) {
    if (date) {
      setValue(date);
      setDates([...dates, date]);
      setOpenCalendar(false)
    }
  }

  function handleDeleteDate(date: Date) {
    setDates(dates.filter(d => d !== date))
  }

  function handleStartTimeChange(event: React.ChangeEvent<HTMLInputElement>) {
    const format= "HH:mm"
    // check if the time is valid
    const time= parse(event.target.value, format, new Date())
    if (time) {
      setStartTime(event.target.value)
    } else {
      toast({title: "Error", description: "Hora inválida", variant: "destructive"})
    } 
  }

  return (
    <div className="w-full">
      <div className="flex justify-between gap-4">
        <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
          <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[420px] pl-3 text-left font-normal",
                  !value && "text-muted-foreground"
                )}
              >
                {value ? (
                  format(value, "PPP", { locale: es })
                ) : (
                  <span>Selecciona la fecha</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>      

        <div className="w-full">
          {dates.map(date => (
            <div key={date.toString()} className="flex items-center justify-between mt-1">
              {format(date, "PPP", { locale: es })}
              <Button variant="destructive" size="icon" onClick={() => handleDeleteDate(date)}>
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex items-center justify-between mt-5">
            <p>Hora de inicio:</p>
            <Input type="time" step={60} value={startTime} onChange={handleStartTimeChange} className="w-32"/>
          </div>
        </div>

      </div>


      <div className="flex justify-end mt-10">
        <Button onClick={() => closeDialog && closeDialog()} type="button" variant={"secondary"} className="w-32">Cancelar</Button>
        <Button onClick={handleSubmit} className="w-32 ml-2 gap-1">
          { loading && <Loader className="h-4 w-4 animate-spin" /> }
          Guardar  
        </Button>
      </div>
   </div>  
  )
}