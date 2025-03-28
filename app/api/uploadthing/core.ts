
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UTApi } from "uploadthing/server";

// Initialize UploadThing API
export const utapi = new UTApi();

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .middleware(async ({ req }) => {
    const userId = "demo-user"; // Replace with actual authentication
    if (!userId) throw new Error("Unauthorized");
    return { userId };
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .onUploadComplete(async ({ metadata, file }) => {
    console.log("Upload complete:", file.url);
    return { url: file.url };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
