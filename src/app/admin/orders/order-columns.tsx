"use client"

import { Button } from "@/components/ui/button"
import { OrderDAO } from "@/services/order-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { DeleteOrderDialog, OrderDialog } from "./order-dialogs"
import { Badge } from "@/components/ui/badge"
import { cn, completeWithZeros, formatWhatsAppStyle, getLabel } from "@/lib/utils"
import MarkAsPaidButton from "./mark-as-paid-button"
import { PaymentMethod } from "@prisma/client"


export const columns: ColumnDef<OrderDAO>[] = [

  {
    accessorKey: "date",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Fecha
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return (
        <div className="flex flex-col gap-2 items-center">
          <Badge className="whitespace-nowrap">
            Orden: {"#" + completeWithZeros(data.number)}
          </Badge>
          <p>{formatWhatsAppStyle(data.createdAt)}</p>
        </div>
      )
    },
  },
  
  {
    accessorKey: "status",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white mx-auto"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Estado
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return (
        <div className="">
          <Badge className={cn("text-black whitespace-nowrap w-52 border border-gray-500 flex justify-center", data.status === "Paid" ? "bg-green-300" : "bg-orange-300")}>
            {getLabel(data.status, data.paymentMethod)}
          </Badge>
          <p>{data.email}</p>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  {
    accessorKey: "name",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Método de Pago
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return (
        <div className="flex flex-col gap-2 items-center">
          <Badge className={cn(
              "text-black whitespace-nowrap w-36 border border-gray-500 flex justify-center", 
              data.paymentMethod === PaymentMethod.MercadoPago ? "bg-sky-300" : "bg-gray-300"
            )}>
            {data.paymentMethod}
          </Badge>
          <p className="font-bold">{data.amount} {data.currency} </p>
        </div>
      )
    },
  },

  {
    accessorKey: "paymentMethod",
    cell: ({ row }) => {
      return null
    },
    header: ({ column }) => { 
      return null
    },      
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Do you want to delete Order ${data.id}?`
 
      return (
        <div className="flex items-center justify-end gap-2">
          <MarkAsPaidButton order={data} />
          <div className="mt-3">
            <DeleteOrderDialog description={deleteDescription} id={data.id} />
          </div>
        </div>

      )
    },
  },
]


