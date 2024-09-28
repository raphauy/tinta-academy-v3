import { MultiStepForm } from "@/app/cursos/inscripcion/multi-step-form";
import { getBankDatasDAO } from "@/services/bankdata-services";
import { getOrderByStudentAndCourse } from "@/services/order-services";
import { auth, currentUser } from "@clerk/nextjs/server";

type Props = {
  searchParams: {
    courseId: string
  }
}
export default async function Inscripcion({ searchParams }: Props) {
  const { sessionClaims } = auth()
  const studentId= sessionClaims?.metadata.studentId

  const bankData = await getBankDatasDAO()
  const courseId = searchParams.courseId
  let order = null
  if (studentId && courseId) {
    order = await getOrderByStudentAndCourse(studentId, courseId)
  }
  console.log("studentId", studentId)
  console.log("courseId", courseId)
  console.log("order", order)
  return (
    <div className="w-full pt-10 flex justify-center">
        <MultiStepForm bankData={bankData} initialOrder={order} />
    </div>
  )
}