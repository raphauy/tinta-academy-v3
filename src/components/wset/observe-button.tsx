"use client"

import { observeCourseAction } from "@/app/admin/courses/course-actions"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { useUser } from "@clerk/nextjs"
import { CheckCircleIcon, Loader } from "lucide-react"
import { useState } from "react"

type Props = {
  courseId: string
  userObserving: boolean
}
export function ObserveButton({ courseId, userObserving }: Props) {
    const [loading, setLoading] = useState(false)
    const { user } = useUser()

    function handleClick() {
        if (!user) {
            toast({ title: "Error", description: "No se ha iniciado sesión" })
            return
        }
        setLoading(true)
        observeCourseAction(user.id, courseId)
        .then(() => {
            toast({ title: "Te notificaremos cuando haya novedades" })
        })
        .catch((error) => {
            toast({ title: "Error", description: error.message })
        })
        .finally(() => {
            setLoading(false)
        })
    }

    if (userObserving) {
        return (
            <Button disabled={true}>
                Novedades del curso
                <CheckCircleIcon className="w-4 h-4 ml-2" />
            </Button>
        )
    }

    return (
        <Button onClick={handleClick} disabled={loading}>
            {loading && <Loader className="w-4 h-4 mr-2" />}
            Quiero recibir novedades
        </Button>
    )
}
