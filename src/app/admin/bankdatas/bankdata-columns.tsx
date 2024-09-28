"use client"

import { Button } from "@/components/ui/button"
import { BankDataDAO } from "@/services/bankdata-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { BankDataDialog, DeleteBankDataDialog } from "./bankdata-dialogs"

export const columns: ColumnDef<BankDataDAO>[] = [
  
  {
    accessorKey: "name",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Name
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "info",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Info
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Do you want to delete BankData ${data.id}?`
 
      return (
        <div className="flex items-center justify-end gap-2">
          <BankDataDialog id={data.id} />
          <DeleteBankDataDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


