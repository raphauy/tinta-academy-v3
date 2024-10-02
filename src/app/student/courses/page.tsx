import { getStudentCoursesDAO } from "@/services/course-services"
import { currentUser } from "@clerk/nextjs/server"
import { StudentCourseCard } from "../student-course-card"
import { getOrderByStudentAndCourse } from "@/services/order-services"


export default async function StudentCoursesPage() {
    const user = await currentUser()
    if (!user) {
        return <div>Usuario no encontrado</div>
    }
    const metadata= user?.publicMetadata
    const studentId = metadata?.studentId as string
    if (!studentId) {
        return <div>No tienes permisos para acceder a esta página</div>
    }
    const courses = await getStudentCoursesDAO(studentId)

    return (
        <div>
            <h1 className="text-2xl font-bold text-center mb-4">Mis cursos</h1>
            <div className="space-y-4">
                {await Promise.all(courses.map(async (course) => {
                    const order = await getOrderByStudentAndCourse(studentId, course.id)
                    return (
                        <StudentCourseCard key={course.id} course={course} order={order} />
                    )
                }))}
            </div>
        </div>
    )
}