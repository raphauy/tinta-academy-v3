import { WsetLevel1 } from "@/components/wset-level-1";
import { findCourseByDateSlug } from "@/services/course-services";

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
  return (
    <div>
      <WsetLevel1 course={course} educator={educator} />
    </div>
  )
}