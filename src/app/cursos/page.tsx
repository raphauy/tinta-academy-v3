import { WsetLevel1Card } from "@/components/wset/wset-level-1-card"
import { getCoursesDAO, getStudentCoursesDAO } from "@/services/course-services"
import { auth, currentUser } from "@clerk/nextjs/server"

export default async function Cursos() {

  const user= await currentUser()
  const studentId = user?.publicMetadata?.studentId as string | undefined

  const courses = await getCoursesDAO()
  const studentCourses = await getStudentCoursesDAO(studentId)

  return (
    <div className="mt-10 mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold mb-10 text-center">Próximos cursos</h1>
        <ul>
          {courses.map((course) => {
            const studentRegistered = studentCourses.some(sc => sc.id === course.id)
            return (
            <li key={course.id}>
              <WsetLevel1Card course={course} educator={course.educator} studentRegistered={studentRegistered} />
            </li>
          )})}
        </ul>
    </div>
  )
}

