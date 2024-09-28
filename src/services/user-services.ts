import * as z from "zod"
import { prisma } from "@/lib/db"
import { StudentDAO } from "./student-services"
import { getStudentsDAO } from "./student-services"

export type UserDAO = {
	id: string
	email: string
	clerkUserId: string
	firstName: string | undefined
	lastName: string | undefined
	imageUrl: string | undefined
	createdAt: Date
	updatedAt: Date
	students: StudentDAO[]
}

export const userSchema = z.object({
	email: z.string().min(1, "email is required."),
	clerkUserId: z.string().min(1, "clerkUserId is required."),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	imageUrl: z.string().optional(),
})

export type UserFormValues = z.infer<typeof userSchema>


export async function getUsersDAO() {
  const found = await prisma.user.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as UserDAO[]
}

export async function getUserDAO(id: string) {
  const found = await prisma.user.findUnique({
    where: {
      id
    },
  })
  return found as UserDAO
}

export async function getUserByClerkUserId(clerkUserId: string): Promise<UserDAO | null> {
  const found = await prisma.user.findUnique({
    where: {
      clerkUserId
    },
  })
  return found as UserDAO | null
}
    
export async function createUser(data: UserFormValues) {
  // TODO: implement createUser
  const created = await prisma.user.create({
    data
  })
  return created
}

export async function updateUser(id: string, data: UserFormValues) {
  const updated = await prisma.user.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function updateUserByClerkUserId(clerkUserId: string, firstName: string | undefined, lastName: string | undefined, imageUrl: string | undefined) {
  const updated = await prisma.user.update({
    where: {
      clerkUserId
    },
    data: {
      firstName,
      lastName,
      imageUrl
    }
  })
  return updated
}

export async function deleteUser(id: string) {
  const deleted = await prisma.user.delete({
    where: {
      id
    },
  })
  return deleted
}
    
export async function getComplentaryStudents(id: string) {
  const found = await prisma.user.findUnique({
    where: {
      id
    },
    include: {
      students: true,
    }
  })
  const all= await getStudentsDAO()
  const res= all.filter(aux => {
    return !found?.students.find(c => c.id === aux.id)
  })
  
  return res
}

export async function setStudents(id: string, students: StudentDAO[]) {
  const oldStudents= await prisma.user.findUnique({
    where: {
      id
    },
    include: {
      students: true,
    }
  })
  .then(res => res?.students)

  await prisma.user.update({
    where: {
      id
    },
    data: {
      students: {
        disconnect: oldStudents
      }
    }
  })

  const updated= await prisma.user.update({
    where: {
      id
    },
    data: {
      students: {
        connect: students.map(c => ({id: c.id}))
      }
    }
  })

  if (!updated) {
    return false
  }

  return true
}



export async function getFullUsersDAO() {
  const found = await prisma.user.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
			students: true,
		}
  })
  return found as UserDAO[]
}
  
export async function getFullUserDAO(id: string) {
  const found = await prisma.user.findUnique({
    where: {
      id
    },
    include: {
			students: true,
		}
  })
  return found as UserDAO
}
    