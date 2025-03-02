"use client";

import { UploadButton } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { FileText } from "lucide-react";

export function FileUpload() {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [pdfUrl, setPdfUrl] = useState<string>("");

  return (
    <div className="space-y-8">
      {/* Uploader de Imágenes */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Subir Imagen</h3>
        <UploadButton
          endpoint="imageUploader"
          content={{
            button({ ready, uploadProgress }) {
              if (uploadProgress) {
                return <Button disabled>Subiendo... {uploadProgress}%</Button>;
              }
              return (
                <Button asChild>
                  <span>{ready ? "Seleccionar Imagen" : "Cargando..."}</span>
                </Button>
              );
            }
          }}
          onClientUploadComplete={(res) => {
            if (res?.[0]) {
              setImageUrl(res[0].url);
              console.log("Imagen subida:", res[0].url);
            }
          }}
          onUploadError={(error: Error) => {
            console.error("Error al subir imagen:", error.message);
          }}
        />
        {imageUrl && (
          <div className="mt-4">
            <Image src={imageUrl} alt="Imagen subida" className="max-w-sm rounded-lg" width={300} height={300} />
          </div>
        )}
      </div>

      {/* Uploader de PDFs */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Subir PDF</h3>
        <UploadButton
          endpoint="pdfUploader"
          content={{
            button({ ready, uploadProgress }) {
              if (uploadProgress) {
                return <Button variant="secondary" disabled>Subiendo... {uploadProgress}%</Button>;
              }
              return (
                <Button variant="secondary" asChild>                  
                  <span>{ready ? <div className="flex items-center gap-2"><FileText className="h-6 w-6 text-muted-foreground" /> <p>Seleccionar PDF</p></div> : "Cargando..."}</span>
                </Button>
              );
            }
          }}
          onClientUploadComplete={(res) => {
            if (res?.[0]) {
              setPdfUrl(res[0].url);
              console.log("PDF subido:", res[0].url);
            }
          }}
          onUploadError={(error: Error) => {
            console.error("Error al subir PDF:", error.message);
          }}
        />
        {pdfUrl && (
          <div className="mt-4">
            <a 
              href={pdfUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Ver PDF subido
            </a>
          </div>
        )}
      </div>
    </div>
  );
} 