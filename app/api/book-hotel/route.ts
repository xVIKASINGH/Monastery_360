import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import hotelsModel from "@/models/hotelsModel";
import { uploadToCloudinary } from "@/lib/uploadCloudinary";

export async function POST(req: Request) {
  try {
    await dbConnect();

    // Get the authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    const owner = session.user.id; // <-- get owner from auth

    const form = await req.formData();

    const name = form.get("name") as string;
    const description = form.get("description") as string;
    const address = form.get("address") as string;
    const pricePerNight = Number(form.get("pricePerNight"));
    const rating = Number(form.get("rating"));
    const closestMonastery = form.get("closestMonastery") as string;

    // Location fields
    const lng = Number(form.get("lng"));
    const lat = Number(form.get("lat"));
    const googleMapsEmbedUrl = form.get("googleMapsEmbedUrl") as string;

    // Multiple images
    const images = form.getAll("images") as File[];

    if (!name || !address || !pricePerNight) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const uploadedImages: string[] = [];

    // Upload each image to Cloudinary
    for (const img of images) {
      try {
        const url = await uploadToCloudinary(img, "hotel-images");
        if (url) {
          uploadedImages.push(url);
        }
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    }

    // Create DB entry
    const hotel = await hotelsModel.create({
      name,
      description,
      address,
      pricePerNight,
      rating,
      owner, // <-- now from session
      closestMonastery,
      images: uploadedImages,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
      googleMapsEmbedUrl,
    });

    console.log("Hotel created:", hotel);
    return NextResponse.json({ success: true, hotel });
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) message = err.message;
    console.log("error occurred", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
