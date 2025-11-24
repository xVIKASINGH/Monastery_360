import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});


export const uploadToCloudinary = async (
  filePath: string,
  folder: string = "uploads"
) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "auto",
    });

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (err: unknown) {
     let message = "Unknown error";

  if (err instanceof Error) {
    message = err.message;
  }

  return { success: false, error: message };
  }
};


// Take inspiration from this code whenn uploading to cloudinary\

// import { NextResponse } from "next/server";
// import { uploadToCloudinary } from "@/lib/cloudinary";

// export async function POST(req: Request) {
//   try {
//     const data = await req.formData();
//     const file: File | null = data.get("file") as unknown as File;

//     if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

//     const bytes = await file.arrayBuffer();
//     const base64 = Buffer.from(bytes).toString("base64");
//     const fileUri = `data:${file.type};base64,${base64}`;

//     const uploadRes = await uploadToCloudinary(fileUri, "my-folder");

//     return NextResponse.json(uploadRes);
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }
