import { NextRequest, NextResponse } from "next/server";
import Hotel from "@/models/hotelsModel";
import dbConnnect from "@/lib/dbConnnect";
export async function GET(req: NextRequest, context: any) {
  try {
    await dbConnnect();
    const { id: monasteryId } = await context.params;
    console.log("Params Id : ", monasteryId);
    if (!monasteryId) {
      return NextResponse.json(
        { success: false, message: "monasteryId is required" },
        { status: 400 }
      );
    }
    const hotels = await Hotel.find({ monasteryId }).lean();
    return NextResponse.json(
      {
        success: true,
        count: hotels.length,
        hotels,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching events:", error);

    return NextResponse.json(
      { success: false, message: "Server error while fetching hotels" },
      { status: 500 }
    );
  }
}
