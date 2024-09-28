import { Button } from "@/components/ui/button"
import { WsetLevel1Card } from "@/components/wset/wset-level-1-card"
import { CourseDAO, getCoursesDAO } from "@/services/course-services"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"

export default async function Cursos() {

  const courses = await getCoursesDAO()

  return (
    <div className="mt-10 mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold mb-10 text-center">Próximos cursos</h1>
        <ul>
          {courses.map((course) => (
            <li key={course.id}>
              <WsetLevel1Card course={course} educator={course.educator} />
            </li>
          ))}
        </ul>
    </div>
  )
}

