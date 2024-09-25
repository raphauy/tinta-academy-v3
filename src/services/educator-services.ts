import * as z from "zod"
import { prisma } from "@/lib/db"

export type EducatorDAO = {
	id: string
	name: string
	title: string
	bio: string
	imageUrl: string
	createdAt: Date
	updatedAt: Date
}

export const educatorSchema = z.object({
	name: z.string().min(1, "name is required."),
	title: z.string().min(1, "title is required."),
	bio: z.string().min(1, "bio is required."),
	imageUrl: z.string().min(1, "imageUrl is required."),
})

export type EducatorFormValues = z.infer<typeof educatorSchema>


export async function getEducatorsDAO() {
  const found = await prisma.educator.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as EducatorDAO[]
}

export async function getEducatorDAO(id: string) {
  const found = await prisma.educator.findUnique({
    where: {
      id
    },
  })
  return found as EducatorDAO
}
    
export async function createEducator(data: EducatorFormValues) {
  // TODO: implement createEducator
  const created = await prisma.educator.create({
    data
  })
  return created
}

export async function updateEducator(id: string, data: EducatorFormValues) {
  const updated = await prisma.educator.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteEducator(id: string) {
  const deleted = await prisma.educator.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullEducatorsDAO() {
  const found = await prisma.educator.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
		}
  })
  return found as EducatorDAO[]
}
  
export async function getFullEducatorDAO(id: string) {
  const found = await prisma.educator.findUnique({
    where: {
      id
    },
    include: {
		}
  })
  return found as EducatorDAO
}
    