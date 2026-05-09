import Monastery from "@/models/monasteriesModel";
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    console.log("Fetching monastery with ID:", params.id);
    await dbConnect();

    let monastery = null;

    // If it's a valid MongoDB ObjectId, try findById first
    if (mongoose.Types.ObjectId.isValid(params.id)) {
      monastery = await Monastery.findById(params.id);
    }

    // If not found by ObjectId, try by numeric id field
    if (!monastery) {
      const numericId = Number(params.id);
      if (!isNaN(numericId)) {
        monastery = await Monastery.findOne({ id: numericId });
      }
    }

    // If still not found, try matching by name (slug-style, e.g. "rumtek")
    if (!monastery) {
      monastery = await Monastery.findOne({
        name: { $regex: new RegExp(params.id, "i") },
      });
    }

    if (!monastery) {
      return new NextResponse("Monastery not found", { status: 404 });
    }

    return NextResponse.json(monastery);
  } catch (error) {
    console.error("Error fetching monastery:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
