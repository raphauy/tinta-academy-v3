"use client"

import { Button } from "@/components/ui/button"
import { StudentDAO } from "@/services/student-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { DeleteStudentDialog, StudentDialog } from "./student-dialogs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export const columns: ColumnDef<StudentDAO>[] = [
  
  {
    accessorKey: "name",
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
      const name= data.firstName + " " + data.lastName      
      return (
        <div className="flex items-center justify-start gap-2">
          <Avatar>
            <AvatarImage src={data.user.imageUrl ?? ""} />
            <AvatarFallback>
              {data.firstName.charAt(0)}
              {data.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <p>{name}</p>
          
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const data= row.original
      const firstName= data.firstName.toLowerCase()
      const lastName= data.lastName.toLowerCase()
      const valueLowerCase= value.toLowerCase()
      return firstName.includes(valueLowerCase) || lastName.includes(valueLowerCase)
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
    accessorKey: "address",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Contacto
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original      
      return (
        <div>
          <p>{data.phone}</p>
          <p>{data.address}</p>
          <p>{data.city} ({data.zip})</p>
        </div>
      )
    }
  },

  {
    accessorKey: "dateOfBirth",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Fecha de nacimiento
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
		cell: ({ row }) => {
      const data= row.original
      const date= data.dateOfBirth && format(new Date(data.dateOfBirth), "yyyy-MM-dd")
      return (<p>{date}</p>)
    }
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Do you want to delete Student ${data.id}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <StudentDialog id={data.id} />
          <DeleteStudentDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


