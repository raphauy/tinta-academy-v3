"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { removeCourseObserverAction } from "../courses/course-actions"
import { toast } from "@/hooks/use-toast"
import { Loader, TrashIcon } from "lucide-react"

type Props = {
    clerkUserId: string
    courseId: string
}
export function RemoveObserverButton({ clerkUserId, courseId }: Props) {
    const [loading, setLoading] = useState(false)

    function handleClick() {
        setLoading(true)
        removeCourseObserverAction(clerkUserId, courseId)
        .then(() => {
            toast({ title: "Interesado quitado" })
        })
        .catch((error) => {
            toast({ title: "Error al quitar interesado", description: error.message })
        })
        .finally(() => {
            setLoading(false)
        })
    }
    
    return (
        <Button onClick={handleClick} disabled={loading} variant="ghost" className="px-3">
            { 
                loading ? <Loader className="w-4 h-4 mr-2" />
                :
                <TrashIcon className="w-5 h-5 text-red-500" />
            }
            
        </Button>
    )
}