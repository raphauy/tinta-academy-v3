"use server"
  
import { revalidatePath } from "next/cache"
import { CouponDAO, CouponFormValues, createCoupon, updateCoupon, getCouponDAO, deleteCoupon, getCouponByCode } from "@/services/coupon-services"
import { CourseDAO } from "@/services/course-services"
import { getActiveCourses } from "@/services/course-services"


export async function getCouponDAOAction(id: string): Promise<CouponDAO | null> {
    return getCouponDAO(id)
}

export async function createOrUpdateCouponAction(id: string | null, data: CouponFormValues): Promise<CouponDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateCoupon(id, data)
    } else {
        updated= await createCoupon(data)
    }     

    revalidatePath("/admin/coupons")

    return updated as CouponDAO
}

export async function deleteCouponAction(id: string): Promise<CouponDAO | null> {    
    const deleted= await deleteCoupon(id)

    revalidatePath("/admin/coupons")

    return deleted as CouponDAO
}

export async function getActiveCoursesAction(): Promise<CourseDAO[]> {
    return getActiveCourses()
}

export async function getCouponByCodeAction(code: string, courseId: string | undefined, loggedEmail: string): Promise<CouponDAO | null> {
    return getCouponByCode(code, courseId, loggedEmail)
}