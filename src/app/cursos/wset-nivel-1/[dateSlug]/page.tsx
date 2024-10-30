import { WsetLevel1 } from "@/components/wset/wset-level-1";
import { CourseDAO, findCourseByDateSlug, getFirstCourseAnounced, getObservedCoursesIds, getStudentCoursesDAO } from "@/services/course-services";
import { currentUser } from "@clerk/nextjs/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'WSET Nivel 1',
  description: 'WSET Nivel 1 Cualificación en Vinos',
  openGraph: {
    title: 'WSET Nivel 1',
    description: 'WSET Nivel 1 Cualificación en Vinos',
    images: ['/Card_WSET_1.jpg'],
  },
  twitter: {
    title: 'WSET Nivel 1',
    description: 'WSET Nivel 1 Cualificación en Vinos',
    images: ['/Card_WSET_1.jpg'],
  }
}
type Props = {
  params: {
    dateSlug: string
  }
}
export default async function WsetLevel1Page({ params }: Props) {
  const dateSlug = params.dateSlug
  let course
  if (dateSlug === "sin-definir") {
    course= await getFirstCourseAnounced("WSET_NIVEL_1")
  } else {
    course= await findCourseByDateSlug(dateSlug, "WSET_NIVEL_1")
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
      <WsetLevel1 course={course} studentRegistered={studentRegistered} userObserving={userObserving} />
    </div>
  )
}