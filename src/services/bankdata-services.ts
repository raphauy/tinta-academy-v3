import * as z from "zod"
import { prisma } from "@/lib/db"
import { OrderDAO } from "./order-services"
import { getOrdersDAO } from "./order-services"

export type BankDataDAO = {
	id: string
	name: string
	info: string
	createdAt: Date
	updatedAt: Date
}

export const bankDataSchema = z.object({
	name: z.string().min(1, "name is required."),
	info: z.string().min(1, "info is required."),
})

export type BankDataFormValues = z.infer<typeof bankDataSchema>


export async function getBankDatasDAO() {
  const found = await prisma.bankData.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as BankDataDAO[]
}

export async function getBankDataDAO(id: string) {
  const found = await prisma.bankData.findUnique({
    where: {
      id
    },
  })
  return found as BankDataDAO
}
    
export async function createBankData(data: BankDataFormValues) {
  // TODO: implement createBankData
  const created = await prisma.bankData.create({
    data
  })
  return created
}

export async function updateBankData(id: string, data: BankDataFormValues) {
  const updated = await prisma.bankData.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteBankData(id: string) {
  const deleted = await prisma.bankData.delete({
    where: {
      id
    },
  })
  return deleted
}
    
export async function getComplentaryOrders(id: string) {
  const found = await prisma.bankData.findUnique({
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
  const oldOrders= await prisma.bankData.findUnique({
    where: {
      id
    },
    include: {
      orders: true,
    }
  })
  .then(res => res?.orders)

  await prisma.bankData.update({
    where: {
      id
    },
    data: {
      orders: {
        disconnect: oldOrders
      }
    }
  })

  const updated= await prisma.bankData.update({
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



export async function getFullBankDatasDAO() {
  const found = await prisma.bankData.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
			orders: true,
		}
  })
  return found as BankDataDAO[]
}
  
export async function getFullBankDataDAO(id: string) {
  const found = await prisma.bankData.findUnique({
    where: {
      id
    },
    include: {
			orders: true,
		}
  })
  return found as BankDataDAO
}
    