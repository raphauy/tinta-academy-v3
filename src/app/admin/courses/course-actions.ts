"use server"
  
import { revalidatePath } from "next/cache"
import { CourseDAO, CourseFormValues, createCourse, updateCourse, getCourseDAO, deleteCourse, setClassDates, observeCourse, removeCourseObserver, checkSlug, setCourseImage } from "@/services/course-services"
import { getCourseStudents, StudentDAO } from "@/services/student-services"

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

export async function observeCourseAction(clerkUserId: string, courseId: string): Promise<boolean> {
    const created= await observeCourse(clerkUserId, courseId)
    if (!created) {
        throw new Error("Error al agregar usuario a curso")
    }
    revalidatePath("/cursos")
    return true
}

export async function removeCourseObserverAction(clerkUserId: string, courseId: string): Promise<boolean> {
    const deleted= await removeCourseObserver(clerkUserId, courseId)
    if (!deleted) {
        throw new Error("Error al remover usuario de curso")
    }
    revalidatePath("/cursos")
    return true
}

export async function checkSlugAction(slug: string, courseId?: string): Promise<boolean> {
    return await checkSlug(slug, courseId)
}

export async function getCourseStudentsAction(courseId: string): Promise<StudentDAO[]> {
    return await getCourseStudents(courseId)
}

export async function setCourseImageAction(courseId: string, imageUrl: string): Promise<boolean> {
    const updated= await setCourseImage(courseId, imageUrl)
    if (!updated) {
        throw new Error("Error setting course image")
    }
    revalidatePath("/admin/courses")
    return true
}