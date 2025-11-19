import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const uploadRouter = {
  // Ruta para subir imágenes de portadas de libros
  bookCoverUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .onUploadComplete(async ({ file }) => {
      console.log("Portada subida:", file.url);
      return { url: file.url };
    }),

  // Ruta para subir PDFs de libros
  bookPdfUploader: f({
    pdf: {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    .onUploadComplete(async ({ file }) => {
      console.log("PDF subido:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
