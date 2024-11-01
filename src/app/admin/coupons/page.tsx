import { getCouponsDAO } from "@/services/coupon-services"
import { CouponDialog } from "./coupon-dialogs"
import { DataTable } from "./coupon-table"
import { columns } from "./coupon-columns"
import { getActiveCourses } from "@/services/course-services"

export default async function CouponPage() {
  
  const data= await getCouponsDAO()

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <CouponDialog />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="Coupon"/>      
      </div>
    </div>
  )
}
  
