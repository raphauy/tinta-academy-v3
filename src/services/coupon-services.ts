import * as z from "zod"
import { prisma } from "@/lib/db"
import { CourseDAO } from "./course-services"
import { OrderDAO } from "./order-services"
import { getOrdersDAO } from "./order-services"
import { currentUser } from "@clerk/nextjs/server"

export type CouponDAO = {
	id: string
	code: string
	discount: number
	maxUses: number
	uses: number
	email: string | undefined
	expiresAt: Date | undefined
	courseId: string | undefined
  course: CourseDAO | undefined
	createdAt: Date
	updatedAt: Date
}

export const couponSchema = z.object({
	code: z.string().min(1, "code is required."),
	discount: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }),
	maxUses: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }),
	email: z.string().optional(),
	expiresAt: z.date().optional(),
	courseId: z.string().optional(),
})

export type CouponFormValues = z.infer<typeof couponSchema>


export async function getCouponsDAO() {
  const found = await prisma.coupon.findMany({
    orderBy: {
      id: 'desc'
    },
    include: {
      course: true
    }
  })
  return found as CouponDAO[]
}

export async function getCouponDAO(id: string) {
  const found = await prisma.coupon.findUnique({
    where: {
      id
    },
  })
  return found as CouponDAO
}
    
export async function createCoupon(data: CouponFormValues) {
  const discount = data.discount ? Number(data.discount) : 0
  const maxUses = data.maxUses ? Number(data.maxUses) : 0
  const couponCode = data.code.toUpperCase()
  
  const created = await prisma.coupon.create({
    data: {
      ...data,
      code: couponCode,
      discount,
      maxUses
    }
  })
  return created
}

export async function updateCoupon(id: string, data: CouponFormValues) {
  const discount = data.discount ? Number(data.discount) : 0
  const maxUses = data.maxUses ? Number(data.maxUses) : 0
  const couponCode = data.code.toUpperCase()

  const updated = await prisma.coupon.update({
    where: {
      id
    },
    data: {
      ...data,
      code: couponCode,
      discount,
      maxUses
    }
  })
  return updated
}

export async function deleteCoupon(id: string) {
  const deleted = await prisma.coupon.delete({
    where: {
      id
    },
  })
  return deleted
}
    
export async function getComplentaryOrders(id: string) {
  const found = await prisma.coupon.findUnique({
    where: {
      id
    },
    include: {
      orders: true,
    }
  })
  const all= await getOrdersDAO()
  const res= all.filter(aux => {
    return !found?.orders.find(c => c.id === aux.id)
  })
  
  return res
}

export async function setOrders(id: string, orders: OrderDAO[]) {
  const oldOrders= await prisma.coupon.findUnique({
    where: {
      id
    },
    include: {
      orders: true,
    }
  })
  .then(res => res?.orders)

  await prisma.coupon.update({
    where: {
      id
    },
    data: {
      orders: {
        disconnect: oldOrders
      }
    }
  })

  const updated= await prisma.coupon.update({
    where: {
      id
    },
    data: {
      orders: {
        connect: orders.map(c => ({id: c.id}))
      }
    }
  })

  if (!updated) {
    return false
  }

  return true
}



export async function getFullCouponsDAO() {
  const found = await prisma.coupon.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
			course: {
        include: {
          educator: true
        }
      },
			orders: true,
		}
  })
  return found as CouponDAO[]
}
  
export async function getFullCouponDAO(id: string) {
  const found = await prisma.coupon.findUnique({
    where: {
      id
    },
    include: {
			course: {
        include: {
          educator: true
        }
      },
			orders: true,
		}
  })
  return found as CouponDAO
}
    

export async function getCouponByCode(code: string, courseId: string | undefined, loggedEmail: string) {
  const found = await prisma.coupon.findUnique({
    where: {
      code,
    },
    include: {
      course: true
    }
  })
  if (!found) {
    return null
  }
  // check if the coupon is expired
  if (found.expiresAt && found.expiresAt < new Date()) {
    return null
  }
  // check if the coupon has reached the maximum number of uses
  if (found.maxUses && found.uses >= found.maxUses) {
    return null
  }
  // check if the coupon has an email and the user logged is the same as the email
  if (found.email && loggedEmail !== found.email) {
    return null
  }
  // check if the coupon has a course and the course is the same as the courseId
  if (found.courseId && courseId && found.courseId !== courseId) {
    return null
  }
  return found as CouponDAO
}

export async function addCouponUse(id: string) {
  const updated= await prisma.coupon.update({
    where: {
      id
    },
    data: {
      uses: { increment: 1 }
    }
  })
}