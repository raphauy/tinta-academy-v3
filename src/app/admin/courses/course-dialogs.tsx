"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { AddDatesForm, CourseForm, DeleteCourseForm } from "./course-forms";

type Props= {
  id?: string
}

const addTrigger= <Button><PlusCircle size={22} className="mr-2"/>Crear Curso</Button>
const updateTrigger= <Pencil size={30} className="pr-2 hover:cursor-pointer"/>

export function CourseDialog({ id }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {id ? updateTrigger : addTrigger }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? 'Actualizar Curso' : 'Crear Curso'}</DialogTitle>
        </DialogHeader>
        <CourseForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}
  
type DeleteProps= {
  id: string
  description: string
}

export function DeleteCourseDialog({ id, description }: DeleteProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="hover:cursor-pointer"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Curso</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteCourseForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}

type AddDatesProps = {
  id: string
  initialDates: Date[]
  initialStartTime: string
}

export function AddDatesDialog({ id, initialDates, initialStartTime }: AddDatesProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Calendar size={22} className="hover:cursor-pointer mr-2"/>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Agregar Fechas</DialogTitle>
          <DialogDescription>Selecciona las fechas para las clases del curso</DialogDescription>
        </DialogHeader>        
        <AddDatesForm id={id} initialDates={initialDates} initialStartTime={initialStartTime} closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}