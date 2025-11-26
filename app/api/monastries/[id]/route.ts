import Monastery from "@/models/monasteriesModel";
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnnect";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    await dbConnect();
    console.log(params.id);

    const monastery = await Monastery.findById(params.id);

    if (!monastery) {
      return new NextResponse("Monastery not found", { status: 404 });
    }

    return NextResponse.json(monastery);
  } catch (error) {
    console.error("Error fetching monastery:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
