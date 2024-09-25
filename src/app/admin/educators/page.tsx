import { getEducatorsDAO } from "@/services/educator-services"
import { EducatorDialog } from "./educator-dialogs"
import { DataTable } from "./educator-table"
import { columns } from "./educator-columns"

export default async function EducatorPage() {
  
  const data= await getEducatorsDAO()

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <EducatorDialog />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="Educator"/>      
      </div>
    </div>
  )
}
  
