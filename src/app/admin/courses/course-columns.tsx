"use client"

import { Button } from "@/components/ui/button"
import { CourseDAO } from "@/services/course-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { DeleteCourseDialog, CourseDialog, AddDatesDialog } from "./course-dialogs"
import { getCourseTypeLabel } from "@/lib/utils"
  

export const columns: ColumnDef<CourseDAO>[] = [
  
  {
    accessorKey: "maxCapacity",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            MaxCapacity
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "priceUSD",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            PriceUSD
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "classDates",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            ClassDates
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
		cell: ({ row }) => {
      const data= row.original
      
      const dates= data.classDates.map(date => format(new Date(date), "yyyy-MM-dd"))
      return (<p>{dates.join(", ")}</p>)
    }
  },

  {
    accessorKey: "type",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Tipo
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
		cell: ({ row }) => {
      const data= row.original
      const label= getCourseTypeLabel(data.type)
      return (<p>{label}</p>)
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Seguro que desea eliminar este curso ${getCourseTypeLabel(data.type)}?`
 
      return (
        <div className="flex items-center justify-end gap-2">
          <AddDatesDialog id={data.id} initialDates={data.classDates} initialStartTime={data.startTime} />
          <CourseDialog id={data.id} />
          <DeleteCourseDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


