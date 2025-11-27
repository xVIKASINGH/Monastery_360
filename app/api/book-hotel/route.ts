import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnnect";
import hotelsModel from "@/models/hotelsModel";
import { uploadToCloudinary } from "@/lib/uploadCloudinary";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const form = await req.formData();

    const name = form.get("name") as string;
    const description = form.get("description") as string;
    const address = form.get("address") as string;
    const pricePerNight = Number(form.get("pricePerNight"));
    const rating = Number(form.get("rating"));
    const owner = form.get("owner") as string;
    const closestMonastery = form.get("closestMonastery") as string;

    // Location fields
    const lng = Number(form.get("lng"));
    const lat = Number(form.get("lat"));
    const googleMapsEmbedUrl = form.get("googleMapsEmbedUrl") as string;

    // Multiple images
    const images = form.getAll("images") as File[];

    if (!name || !address || !pricePerNight || !owner) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const uploadedImages: string[] = [];

    // Upload each image to Cloudinary
    for (const img of images) {
      const bytes = await img.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      const imgUri = `data:${img.type};base64,${base64}`;

      const uploadRes = await uploadToCloudinary(
        imgUri,
        "hotel-images"
      );

      if (uploadRes.success && uploadRes.url) {
        uploadedImages.push(uploadRes.url);
      }
    }

    // Create DB entry
    const hotel = await hotelsModel.create({
      name,
      description,
      address,
      pricePerNight,
      rating,
      owner,
      closestMonastery,
      images: uploadedImages,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
      googleMapsEmbedUrl,
    });
    console.log("Hotel created:", hotel)
    return NextResponse.json({ success: true, hotel });
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) message = err.message;

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
