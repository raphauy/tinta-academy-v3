"use server"
  
import { revalidatePath } from "next/cache"
import { StudentDAO, StudentFormValues, createStudent, updateStudent, getStudentDAO, deleteStudent } from "@/services/student-services"


export async function getStudentDAOAction(id: string): Promise<StudentDAO | null> {
    return getStudentDAO(id)
}

export async function createOrUpdateStudentAction(id: string | null, data: StudentFormValues): Promise<StudentDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateStudent(id, data)
    } else {
        updated= await createStudent(data)
    }     

    revalidatePath("/admin/students")

    return updated as StudentDAO
}

export async function deleteStudentAction(id: string): Promise<StudentDAO | null> {    
    const deleted= await deleteStudent(id)

    revalidatePath("/admin/students")

    return deleted as StudentDAO
}

