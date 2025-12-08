import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/lib/dbConnect";
import ticketbookingModel from "@/models/ticketbookingModel";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    await connectDB();

    // 🔐 Get logged-in user
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await req.json();
    const {
      paymentId,
      orderId,
      signature,
      eventId,
      ticketPrice,
      numberOfPeople,
      totalAmount,
    } = body;

    if (!paymentId || !orderId || !signature) {
      return NextResponse.json(
        { error: "Missing payment details" },
        { status: 400 }
      );
    }

 

    // 💾 Save booking
    const booking = await ticketbookingModel.create({
      user: userId,
      event: eventId,
      date: new Date(),
      numberOfPeople,
      ticketPrice,
      totalAmount,
      orderId,
      paymentId,
      paymentStatus: "success",
    });

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Booking Error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
