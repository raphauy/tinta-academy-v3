import { getBankDatasDAO } from "@/services/bankdata-services"
import { BankDataDialog } from "./bankdata-dialogs"
import { DataTable } from "./bankdata-table"
import { columns } from "./bankdata-columns"

export default async function BankDataPage() {
  
  const data= await getBankDatasDAO()

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <BankDataDialog />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="BankData"/>      
      </div>
    </div>
  )
}
  
