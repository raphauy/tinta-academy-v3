import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      const session = await auth();
      if (!session) throw new UploadThingError("No autorizado");
      return { userId: session.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Imagen subida:", file.ufsUrl);
      return {
        uploadedBy: metadata.userId,
        url: file.ufsUrl,
        name: file.name,
      };
    }),

  pdfUploader: f({
    pdf: {
      maxFileSize: "8MB",
      maxFileCount: 1,      
    },
  })
    .middleware(async () => {
      const session = await auth();
      if (!session) throw new UploadThingError("No autorizado");
      return { userId: session.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("PDF subido:", metadata);
      return {
        uploadedBy: metadata.userId,
        url: file.ufsUrl,
        name: file.name,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
