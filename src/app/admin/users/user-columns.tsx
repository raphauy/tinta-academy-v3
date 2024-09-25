"use client"

import { Button } from "@/components/ui/button"
import { UserDAO } from "@/services/user-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { DeleteUserDialog, UserDialog } from "./user-dialogs"
import Image from "next/image"


export const columns: ColumnDef<UserDAO>[] = [

  {
    accessorKey: "imageUrl",
    header: ({ column }) => {
        return <div className="w-10"></div>
    },
    cell: ({ row }) => {
      const data= row.original
      if (!data.imageUrl) return null
      const alt= `${data.firstName} ${data.lastName}`
      return (
        <Image src={data.imageUrl} alt={alt} width={32} height={32} className="rounded-full"/>
      )
    },
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
    accessorKey: "firstName",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Nombre
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return (
        <p>{data.firstName} {data.lastName}</p>
      )
    },
  },

  {
    accessorKey: "clerkUserId",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            ClerkUserId
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Do you want to delete User ${data.id}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <UserDialog id={data.id} />
          <DeleteUserDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


