"use client"

import { useEffect, useState } from "react";
import { ArrowLeftRight, ChevronsLeft, ChevronsRight, Loader, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast";
import { BankDataForm, DeleteBankDataForm } from "./bankdata-forms"
import { getBankDataDAOAction } from "./bankdata-actions"

import { getComplentaryOrdersAction, setOrdersAction } from "./bankdata-actions"
import { OrderDAO } from "@/services/order-services"  
  
type Props= {
  id?: string
}

const addTrigger= <Button><PlusCircle size={22} className="mr-2"/>Create BankData</Button>
const updateTrigger= <Pencil size={30} className="pr-2 hover:cursor-pointer"/>

export function BankDataDialog({ id }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {id ? updateTrigger : addTrigger }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? 'Update' : 'Create'} BankData
          </DialogTitle>
        </DialogHeader>
        <BankDataForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}
  
type DeleteProps= {
  id: string
  description: string
}

export function DeleteBankDataDialog({ id, description }: DeleteProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="hover:cursor-pointer"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete BankData</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteBankDataForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}
