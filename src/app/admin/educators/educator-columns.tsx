"use client"

import { Button } from "@/components/ui/button"
import { EducatorDAO } from "@/services/educator-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { DeleteEducatorDialog, EducatorDialog } from "./educator-dialogs"
import Image from "next/image"


export const columns: ColumnDef<EducatorDAO>[] = [
  
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
    cell: ({ row }) => {
      const data= row.original
      return (
        <div className="flex items-center gap-2 min-w-56">
          <Image src={data.imageUrl} alt={data.name} width={50} height={50} className="rounded-full"/>
          <div>
              <h3 className="text-xl font-semibold">{data.name}</h3>
              <p className="text-muted-foreground">{data.title}</p>
            </div>
        </div>
      )
    }
  },

  {
    accessorKey: "bio",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Bio
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Do you want to delete Educator ${data.id}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <EducatorDialog id={data.id} />
          <DeleteEducatorDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


