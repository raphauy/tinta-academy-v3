import { CourseCard } from "@/app/admin/courses/course-card"
import { getCoursesDAO } from "@/services/course-services"
import { CourseDialog } from "./course-dialogs"

export default async function CoursePage() {
  
  const data= await getCoursesDAO()

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <CourseDialog />
      </div>

      {/* <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="Course"/>      
      </div> */}

      <div className="space-y-4">
        {data.map((course) => {
          return (<CourseCard key={course.id} course={course} />)
        })}
      </div>
    </div>
  )
}
  
