import { getActiveCoursesDAO, getObservedCoursesIds, getStudentCoursesDAO } from "@/services/course-services"
import { currentUser } from "@clerk/nextjs/server"
import { WsetCard } from "./wset-card"

export default async function Cursos() {

  const user= await currentUser()
  const studentId = user?.publicMetadata?.studentId as string | undefined

  const courses = await getActiveCoursesDAO()
  const studentCourses = await getStudentCoursesDAO(studentId)
  const observedCoursesIds = await getObservedCoursesIds(user?.id as string)
  console.log("userId: ", user?.id)
  console.log("observedCoursesIds: ", observedCoursesIds)
  return (
    <div className="mt-10 mx-auto max-w-6xl px-4">
        <h1 className="text-2xl font-bold mb-10 text-center">Próximos cursos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => {
            const studentRegistered = studentCourses.some(sc => sc.id === course.id)
            const userObserving = observedCoursesIds.some(id => id === course.id)
            return (
              <WsetCard 
                key={course.id}
                course={course} 
                studentRegistered={studentRegistered} 
                userObserving={userObserving} 
              />
          )})}
        </div>
    </div>
  )
}

