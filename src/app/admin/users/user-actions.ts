"use server"
  
import { revalidatePath } from "next/cache"
import { UserDAO, UserFormValues, createUser, updateUser, getUserDAO, deleteUser } from "@/services/user-services"

import { getComplentaryStudents, setStudents} from "@/services/user-services"
import { StudentDAO } from "@/services/student-services"
    

export async function getUserDAOAction(id: string): Promise<UserDAO | null> {
    return getUserDAO(id)
}

export async function createOrUpdateUserAction(id: string | null, data: UserFormValues): Promise<UserDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateUser(id, data)
    } else {
        updated= await createUser(data)
    }     

    revalidatePath("/admin/users")

    return updated as UserDAO
}

export async function deleteUserAction(id: string): Promise<UserDAO | null> {    
    const deleted= await deleteUser(id)

    revalidatePath("/admin/users")

    return deleted as UserDAO
}
    
export async function getComplentaryStudentsAction(id: string): Promise<StudentDAO[]> {
    const complementary= await getComplentaryStudents(id)

    return complementary as StudentDAO[]
}

export async function setStudentsAction(id: string, students: StudentDAO[]): Promise<boolean> {
    const res= setStudents(id, students)

    revalidatePath("/admin/users")

    return res
}


