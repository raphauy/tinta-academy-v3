"use server"
  
import { revalidatePath } from "next/cache"
import { EducatorDAO, EducatorFormValues, createEducator, updateEducator, getEducatorDAO, deleteEducator, getEducatorsDAO } from "@/services/educator-services"


export async function getEducatorDAOAction(id: string): Promise<EducatorDAO | null> {
    return getEducatorDAO(id)
}

export async function getEducatorsAction(): Promise<EducatorDAO[]> {
    return getEducatorsDAO()
}

export async function createOrUpdateEducatorAction(id: string | null, data: EducatorFormValues): Promise<EducatorDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateEducator(id, data)
    } else {
        updated= await createEducator(data)
    }     

    revalidatePath("/admin/educators")

    return updated as EducatorDAO
}

export async function deleteEducatorAction(id: string): Promise<EducatorDAO | null> {    
    const deleted= await deleteEducator(id)

    revalidatePath("/admin/educators")

    return deleted as EducatorDAO
}

