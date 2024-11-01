"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CouponDAO } from "@/services/coupon-services"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { ArrowUpDown, Check } from "lucide-react"
import { CouponDialog, DeleteCouponDialog } from "./coupon-dialogs"


export const columns: ColumnDef<CouponDAO>[] = [
  
  {
    accessorKey: "code",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Código
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "discount",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Descuento
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return <p>{data.discount} %</p>
    }
  },

  {
    accessorKey: "uses",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Usos
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      const used= data.uses === data.maxUses
      return (
        <div className="flex items-center gap-2">
          <p>{data.uses}/{data.maxUses}</p>
          {used && <Check className="text-green-500" />}
        </div>
      )
    }
  },

  {
    accessorKey: "email",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Email
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "expiresAt",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Expira
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
		cell: ({ row }) => {
      const data= row.original
      const date= data.expiresAt && format(data.expiresAt, "yyyy-MM-dd")
      const now= new Date()
      const label= data.expiresAt && now >= data.expiresAt ? "Expirado" : !data.expiresAt ? "No expira" : ""
      return (
        <div>
          <p className={cn(label !== "Expirado" && "text-green-500")}>{date}</p>
          <p className={cn(label === "Expirado" && "text-red-500")}>{label}</p>
        </div>
      )
    }
  },
  {
    accessorKey: "courseId",
    header: ({ column }) => {
      return <p>Curso</p>
    },
    cell: ({ row }) => {
      const data= row.original
      return <p>{data.course && data.course.title}</p>
    }
  },
  // {
  //   accessorKey: "role",
  //   header: ({ column }) => {
  //     return (
  //       <Button variant="ghost" className="pl-0 dark:text-white"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
  //         Rol
  //         <ArrowUpDown className="w-4 h-4 ml-1" />
  //       </Button>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Do you want to delete Coupon ${data.id}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <CouponDialog id={data.id} />
          <DeleteCouponDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


