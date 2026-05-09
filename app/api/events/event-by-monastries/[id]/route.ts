import { NextResponse } from "next/server";
import eventsModel from "@/models/eventsModel";
import Monastery from "@/models/monasteriesModel";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

export async function GET(req: Request, context: any) {
  try {
    await dbConnect();

    // 👇 FIX: unwrap params from the context
    const { id: monasteryId } = await context.params;

    console.log("params id:", monasteryId);

    if (!monasteryId) {
      return NextResponse.json(
        { success: false, message: "monasteryId is required" },
        { status: 400 }
      );
    }

    // Resolve the actual MongoDB _id if a slug/name was passed
    let resolvedId = monasteryId;

    if (!mongoose.Types.ObjectId.isValid(monasteryId)) {
      // Try finding by numeric id or name slug
      let monastery = null;
      const numericId = Number(monasteryId);
      if (!isNaN(numericId)) {
        monastery = await Monastery.findOne({ id: numericId });
      }
      if (!monastery) {
        monastery = await Monastery.findOne({
          name: { $regex: new RegExp(monasteryId, "i") },
        });
      }
      if (monastery) {
        resolvedId = monastery._id.toString();
      }
    }

    const events = await eventsModel.find({ monasteryId: resolvedId }).lean();
    return NextResponse.json(
      {
        success: true,
        count: events.length,
        events,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching events:", err);

    return NextResponse.json(
      { success: false, message: "Server error while fetching events" },
      { status: 500 }
    );
  }
}
