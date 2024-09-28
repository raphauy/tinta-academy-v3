"use server"
  
import { revalidatePath } from "next/cache"
import { BankDataDAO, BankDataFormValues, createBankData, updateBankData, getBankDataDAO, deleteBankData, getBankDatasDAO } from "@/services/bankdata-services"

import { getComplentaryOrders, setOrders} from "@/services/bankdata-services"
import { OrderDAO } from "@/services/order-services"
    

export async function getBankDataDAOAction(id: string): Promise<BankDataDAO | null> {
    return getBankDataDAO(id)
}

export async function getBankDatasDAOAction(): Promise<BankDataDAO[]> {
    return getBankDatasDAO()
}

export async function createOrUpdateBankDataAction(id: string | null, data: BankDataFormValues): Promise<BankDataDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateBankData(id, data)
    } else {
        updated= await createBankData(data)
    }     

    revalidatePath("/admin/bankdatas")

    return updated as BankDataDAO
}

export async function deleteBankDataAction(id: string): Promise<BankDataDAO | null> {    
    const deleted= await deleteBankData(id)

    revalidatePath("/admin/bankdatas")

    return deleted as BankDataDAO
}
    
export async function getComplentaryOrdersAction(id: string): Promise<OrderDAO[]> {
    const complementary= await getComplentaryOrders(id)

    return complementary as OrderDAO[]
}

export async function setOrdersAction(id: string, orders: OrderDAO[]): Promise<boolean> {
    const res= setOrders(id, orders)

    revalidatePath("/admin/bankdatas")

    return res
}


