// UploadThing client configuration
import { generateReactHelpers } from "@uploadthing/react";

// Use the backend's file router type
export const { useUploadThing, uploadFiles } =
  generateReactHelpers({
    url: "http://localhost:3000/api/uploadthing",
  });
