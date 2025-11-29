// File: /app/api/get-monastry/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnnect";
import monasteriesModel from "@/models/monasteriesModel";

export async function GET() {
  try {
    await dbConnect();
    // Only select id & name
    const monasteries = await monasteriesModel.find({}, "_id name");
    console.log("Fetched monasteries:", monasteries.length);
    return NextResponse.json(
      {
        success: true,
        monasteries,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 Error fetching monasteries:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
