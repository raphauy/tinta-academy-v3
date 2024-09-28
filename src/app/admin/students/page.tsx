import { getStudentsDAO } from "@/services/student-services"
import { StudentDialog } from "./student-dialogs"
import { DataTable } from "./student-table"
import { columns } from "./student-columns"

export default async function StudentPage() {
  
  const data= await getStudentsDAO()

  return (
    <div className="w-full">      

      <h1 className="text-2xl font-bold text-center mb-4">Estudiantes</h1>

      {/* <div className="flex justify-end mx-auto my-2">
        <StudentDialog />
      </div> */}

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="Student"/>      
      </div>
    </div>
  )
}
  
