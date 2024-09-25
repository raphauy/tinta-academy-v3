"use server"
  
import { revalidatePath } from "next/cache"
import { CourseDAO, CourseFormValues, createCourse, updateCourse, getCourseDAO, deleteCourse, setClassDates } from "@/services/course-services"

export async function getCourseDAOAction(id: string): Promise<CourseDAO | null> {
    return getCourseDAO(id)
}

export async function createOrUpdateCourseAction(id: string | null, data: CourseFormValues): Promise<CourseDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateCourse(id, data)
    } else {
        updated= await createCourse(data)
    }     

    revalidatePath("/admin/courses")

    return updated as CourseDAO
}

export async function deleteCourseAction(id: string): Promise<CourseDAO | null> {    
    const deleted= await deleteCourse(id)

    revalidatePath("/admin/courses")

    return deleted as CourseDAO
}
    
export async function setClassDatesAndTimeAction(id: string, dates: Date[], startTime: string): Promise<boolean> {
    const updated= await setClassDates(id, dates, startTime)
    if (!updated) {
        throw new Error("Error setting class dates")
    }

    revalidatePath("/admin/educators")

    return true
}