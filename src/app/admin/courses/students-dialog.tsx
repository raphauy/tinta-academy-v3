"use client"

import * as React from "react"
import { Download, Users } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StudentDAO } from "@/services/student-services"
import { useEffect, useState } from "react"
import { getCourseStudentsAction } from "./course-actions"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Props {
  courseId: string
  courseSlug: string
}

export default function StudentsDialog({ courseId, courseSlug }: Props) {
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
        <MainContent students={students} courseSlug={courseSlug} /> : 
        <EmptyContent />
      }
    </Dialog>
  )
}

function MainContent({ students, courseSlug }: { students: StudentDAO[], courseSlug: string }) {
  const handleExportCSV = () => {
    // Crear el contenido del CSV
    const headers = ["Nombre", "Email"];
    const csvContent = [
      headers.join(","),
      ...students.map(student => 
        [`${student.firstName} ${student.lastName}`, student.email].join(",")
      )
    ].join("\n");
    
    // Crear un blob con el contenido
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    // Formatear la fecha actual para el nombre del archivo
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const formattedTime = `${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`;
    
    // Crear un enlace temporal y hacer clic en él para descargar
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `estudiantes_${courseSlug}_${formattedDate}_${formattedTime}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Lista de Estudiantes</DialogTitle>
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={handleExportCSV}
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </DialogHeader>
      <ScrollArea className="h-full max-h-[400px]">
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
      </ScrollArea>
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