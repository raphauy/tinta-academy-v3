import { WsetLevel1 } from "@/components/wset/wset-level-1";
import { findCourseByDateSlug, getStudentCoursesDAO } from "@/services/course-services";
import { currentUser } from "@clerk/nextjs/server";

type Props = {
  params: {
    dateSlug: string
  }
}
export default async function WsetLevel1Page({ params }: Props) {
  const dateSlug = params.dateSlug
  const courses = await findCourseByDateSlug(dateSlug)
  const course = courses[0]
  if (!course) {
    return <div>Curso no encontrado</div>
  }
  const educator = course.educator

  const user = await currentUser()
  const studentId = user?.publicMetadata?.studentId as string | undefined
  const studentCourses = await getStudentCoursesDAO(studentId)
  const studentRegistered = studentCourses.some(sc => sc.id === course.id)
  return (
    <div>
      <WsetLevel1 course={course} educator={educator} studentRegistered={studentRegistered} />
    </div>
  )
}