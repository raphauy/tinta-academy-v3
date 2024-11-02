"use client"

import * as React from "react"
import { Users } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StudentDAO } from "@/services/student-services"
import { useEffect, useState } from "react"
import { getCourseStudentsAction } from "./course-actions"
import { Button } from "@/components/ui/button"

interface Props {
  courseId: string
}

export default function StudentsDialog({ courseId }: Props) {
  const [students, setStudents] = useState<StudentDAO[]>([])

  useEffect(() => {
    getCourseStudentsAction(courseId)
    .then(setStudents)
  }, [courseId])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="gap-2 h-8">
          <Users className="h-4 w-4" />
          {students.length} {students.length === 1 ? "Estudiante" : "Estudiantes"}
        </Button>
      </DialogTrigger>
      {
        students.length > 0 ? 
        <MainContent students={students} /> : 
        <EmptyContent />
      }
    </Dialog>
  )
}

function MainContent({ students }: { students: StudentDAO[] }) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Lista de Estudiantes</DialogTitle>
      </DialogHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.firstName + " " + student.lastName}</TableCell>
              <TableCell>{student.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DialogContent>
  )
}

function EmptyContent() {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>No hay estudiantes</DialogTitle>
      </DialogHeader>
    </DialogContent>
  )
}