import { prisma } from "@/lib/db"
import * as z from "zod"
import { UserDAO } from "./user-services"

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
  user: UserDAO
	userId: string
}

export const studentSchema = z.object({
	firstName: z.string().min(1, "El nombre es obligatorio."),
	lastName: z.string().min(1, "El apellido es obligatorio."),
	dateOfBirth: z.date({required_error: "La fecha de nacimiento es obligatoria."}),
	phone: z.string().min(1, "El teléfono es obligatorio."),
	address: z.string().min(1, "La dirección es obligatoria."),
	city: z.string().min(1, "La ciudad es obligatoria."),
	zip: z.string().optional(),
	country: z.string().min(1, "El país es obligatorio."),
})

export type StudentFormValues = z.infer<typeof studentSchema>


export async function getStudentsDAO() {
  const found = await prisma.student.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
      user: true
    }
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

export async function getCurrentStudentId(email: string) {
  const found = await prisma.student.findUnique({
    where: {
      email
    },
  })
  return found?.id
}
    
export async function createStudent(userDAO: UserDAO,data: StudentFormValues) {
  const created = await prisma.student.create({
    data: {
      ...data,
      userId: userDAO.id,
      email: userDAO.email
    }
  })
  if (!created) {
    throw new Error("No se pudo crear el estudiante.")
  }
  // set the studentId to clerk metadata
  // TODO
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

export async function getCourseStudents(courseId: string): Promise<StudentDAO[]> {
  const students = await prisma.course.findUnique({
    where: { 
      id: courseId 
    },
    include: { 
      orders: {
        include: {
          student: true
        }
      }
    }
  })
  return students?.orders.map((order) => order.student) as StudentDAO[]
}