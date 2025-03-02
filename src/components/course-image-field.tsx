'use client'

import * as React from 'react'
import { useToast } from '@/hooks/use-toast'
import { Camera, Loader } from 'lucide-react'
import { generateReactHelpers } from "@uploadthing/react"
import { OurFileRouter } from '@/app/api/uploadthing/core'
import { setCourseImageAction } from '@/app/admin/courses/course-actions'
import Image from 'next/image'

const { useUploadThing } = generateReactHelpers<OurFileRouter>()

type Props = {
  courseId: string
  imageUrl: string | null | undefined
}

export function CourseImageField({ courseId, imageUrl }: Props) {
  const { toast } = useToast()
  const [courseImageUrl, setCourseImageUrl] = React.useState<string | null | undefined>(imageUrl)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: async (res) => {
      if (res?.[0]) {
        const imageUrl = res[0].ufsUrl
        const success = await setCourseImageAction(courseId, imageUrl)
        if (success) {
          setCourseImageUrl(imageUrl)
          toast({
            title: "Imagen actualizada",
            description: "La imagen del curso se ha actualizado correctamente.",
          })
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "No se pudo actualizar la imagen. Por favor, intenta de nuevo.",
          })
        }
      }
    },
    onUploadError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Error al subir la imagen.",
      })
    },
  })

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await startUpload([file])
    }
  }

  return (
    <div className="absolute inset-0 cursor-pointer" onClick={handleClick}>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      
      {isUploading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Loader className="h-8 w-8 text-muted-foreground animate-spin" />
        </div>
      ) : courseImageUrl ? (
        <div className="absolute inset-0 overflow-hidden">
          <Image 
            src={courseImageUrl} 
            alt="Imagen del curso"
            fill
            className="object-cover transition-opacity hover:opacity-90"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
            <Camera className="h-10 w-10 text-white" />
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted border-2 border-dashed border-muted-foreground/50 hover:border-muted-foreground/70 transition-colors">
          <Camera className="h-10 w-10 text-muted-foreground mb-2" />
          <span className="text-muted-foreground text-center px-4">Agregar imagen del curso</span>
        </div>
      )}
    </div>
  )
}