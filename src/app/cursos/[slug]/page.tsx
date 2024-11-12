import { CourseDetails } from "@/components/wset/course-details";
import { WsetLevel1 } from "@/components/wset/wset-level-1";
import { WsetLevel2 } from "@/components/wset/wset-level-2";
import { findCourseBySlug, getObservedCoursesIds, getStudentCoursesDAO } from "@/services/course-services";
import { currentUser } from "@clerk/nextjs/server";
import { Metadata } from "next";

type Props = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = await findCourseBySlug(params.slug)
  
  if (!course) {
    return {
      title: 'Curso no encontrado',
      description: 'El curso que buscas no existe'
    }
  }

  const imageUrl = course.type === "WSET_NIVEL_1" ? "/Card_WSET_1.jpg" : "/Card_WSET_2.jpg"
  const description = course.type === "WSET_NIVEL_1" ? "WSET Nivel 1 Cualificación en Vinos" : course.type === "WSET_NIVEL_2" ? "WSET Nivel 2 Cualificación en Vinos" : course.description ?? ""

  return {
    title: course.title,
    description: course.description,
    openGraph: {
      title: course.title,
      description,
      images: [imageUrl],
    },
    twitter: {
      title: course.title,
      description,
      images: [imageUrl],
    }
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

  if (course.type === "WSET_NIVEL_1") {
    return <WsetLevel1 course={course} studentRegistered={studentRegistered} userObserving={userObserving} />
  }
  if (course.type === "WSET_NIVEL_2") {
    return <WsetLevel2 course={course} studentRegistered={studentRegistered} userObserving={userObserving} />
  }
  
  return (
    <CourseDetails course={course} studentRegistered={studentRegistered} userObserving={userObserving} />
  )
}