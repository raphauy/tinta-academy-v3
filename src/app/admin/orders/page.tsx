import { getOrdersDAO } from "@/services/order-services"
import { OrderDialog } from "./order-dialogs"
import { DataTable } from "./order-table"
import { columns } from "./order-columns"

export default async function OrderPage() {
  
  const data= await getOrdersDAO()

  return (
    <div className="w-full">      

      <h1 className="text-2xl font-bold text-center mb-4">Ordenes</h1>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="Order"/>      
      </div>
    </div>
  )
}
  
