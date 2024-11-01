import { WsetLevel2 } from "@/components/wset/wset-level-2";
import { findCourseBySlug, getFirstCourseAnounced, getObservedCoursesIds, getStudentCoursesDAO } from "@/services/course-services";
import { currentUser } from "@clerk/nextjs/server";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'WSET Nivel 2',
  description: 'Curso de WSET Nivel 2',
  openGraph: {
    title: 'WSET Nivel 2',
    description: 'WSET Nivel 2 Cualificación en Vinos',
    images: ['/Card_WSET_2.jpg'],
  },
  twitter: {
    title: 'WSET Nivel 2',
    description: 'WSET Nivel 2 Cualificación en Vinos',
    images: ['/Card_WSET_2.jpg'],
  },
}
type Props = {
  params: {
    slug: string
  }
}
export default async function WsetLevel1Page({ params }: Props) {
  const slug = params.slug
  let course= await findCourseBySlug(slug)

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