import { WsetLevel2 } from "@/components/wset/wset-level-2";
import { findCourseByDateSlug, getFirstCourseAnounced, getObservedCoursesIds, getStudentCoursesDAO } from "@/services/course-services";
import { currentUser } from "@clerk/nextjs/server";

type Props = {
  params: {
    dateSlug: string
  }
}
export default async function WsetLevel1Page({ params }: Props) {
  const dateSlug = params.dateSlug
  let course
  if (dateSlug === "sin-definir") {
    course= await getFirstCourseAnounced("WSET_NIVEL_2")
  } else {
    course= await findCourseByDateSlug(dateSlug, "WSET_NIVEL_2")
  }

  if (!course) return <div>Curso no encontrado</div>

  const user = await currentUser()
  const studentId = user?.publicMetadata?.studentId as string | undefined
  const studentCourses = await getStudentCoursesDAO(studentId)
  const studentRegistered = studentCourses.some(sc => sc.id === course.id)
  const observedCoursesIds = await getObservedCoursesIds(user?.id as string)
  const userObserving = observedCoursesIds.includes(course.id)

  return (
    <div>
      <WsetLevel2 course={course} studentRegistered={studentRegistered} userObserving={userObserving} />
    </div>
  )
}