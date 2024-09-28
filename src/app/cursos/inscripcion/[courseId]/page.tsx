import { getBankDatasDAO } from "@/services/bankdata-services";
import { getOrderByStudentAndCourse } from "@/services/order-services";
import { auth } from "@clerk/nextjs/server";
import { MultiStepForm } from "./multi-step-form";

type Props = {
  params: {
    courseId: string
  }
}
export default async function Inscripcion({ params }: Props) {
  const { sessionClaims } = auth()
  const studentId= sessionClaims?.metadata.studentId

  const bankData = await getBankDatasDAO()
  const courseId = params.courseId
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