"use server"
  
import { revalidatePath } from "next/cache"
import { StudentDAO, StudentFormValues, createStudent, updateStudent, getStudentDAO, deleteStudent, getCurrentStudentId } from "@/services/student-services"
import { clerkClient, currentUser } from "@clerk/nextjs/server"
import { getUserByClerkUserId } from "@/services/user-services"


export async function getStudentDAOAction(id: string): Promise<StudentDAO | null> {
    return getStudentDAO(id)
}

export async function getCurrentStudentIdAction(): Promise<string | undefined> {
    const user = await currentUser()
    if (!user) throw new Error("Current user not found")

    return getCurrentStudentId(user.emailAddresses[0].emailAddress)
}

export async function createOrUpdateStudentAction(id: string | null, data: StudentFormValues): Promise<StudentDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateStudent(id, data)
    } else {
        const clerkUser= await currentUser()
        if (!clerkUser) throw new Error("Usuario actual no encontrado")
        console.log("clerkUser.id: ", clerkUser.id)
        const user = await getUserByClerkUserId(clerkUser.id)
        if (!user) throw new Error("Usuario no encontrado")
        updated= await createStudent(user, data)
        if (updated) {
            const res = await clerkClient().users.updateUser(clerkUser.id, {
                publicMetadata: { role: "student", studentId: updated.id },
            })          
        }
    }     

    revalidatePath("/admin/students")

    return updated as StudentDAO

}

export async function deleteStudentAction(id: string): Promise<StudentDAO | null> {    
    const deleted= await deleteStudent(id)

    revalidatePath("/admin/students")

    return deleted as StudentDAO
}

