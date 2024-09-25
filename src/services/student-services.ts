import * as z from "zod"
import { prisma } from "@/lib/db"

export type StudentDAO = {
	id: string
	firstName: string
	lastName: string
	dateOfBirth: Date
	email: string
	phone: string
	address: string
	city: string
	zip: string | undefined
	country: string
	createdAt: Date
	updatedAt: Date
	userId: string
}

export const studentSchema = z.object({
	firstName: z.string().min(1, "El nombre es obligatorio."),
	lastName: z.string().min(1, "El apellido es obligatorio."),
	dateOfBirth: z.date({required_error: "La fecha de nacimiento es obligatoria."}),
	email: z.string().min(1, "El correo electrónico es obligatorio."),
	phone: z.string().min(1, "El teléfono es obligatorio."),
	address: z.string().min(1, "La dirección es obligatoria."),
	city: z.string().min(1, "La ciudad es obligatoria."),
	zip: z.string().optional(),
	country: z.string().min(1, "El país es obligatorio."),
  userId: z.string().min(1, "El usuario es obligatorio."),
})

export type StudentFormValues = z.infer<typeof studentSchema>


export async function getStudentsDAO() {
  const found = await prisma.student.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as StudentDAO[]
}

export async function getStudentDAO(id: string) {
  const found = await prisma.student.findUnique({
    where: {
      id
    },
  })
  return found as StudentDAO
}
    
export async function createStudent(data: StudentFormValues) {
  // TODO: implement createStudent
  const created = await prisma.student.create({
    data
  })
  return created
}

export async function updateStudent(id: string, data: StudentFormValues) {
  const updated = await prisma.student.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteStudent(id: string) {
  const deleted = await prisma.student.delete({
    where: {
      id
    },
  })
  return deleted
}

