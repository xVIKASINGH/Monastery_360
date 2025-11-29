// Server-only API route: do not add "use client" here
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnnect from "@/lib/dbConnnect";
import User from "@/models/User";
// ensure related models are registered so populate works
import "@/models/ticketbookingModel"; // registers Booking
import "@/models/eventsModel"; // registers Event
import "@/models/monasteriesModel"; // registers Monastery

export async function GET() {
  try {
    await dbConnnect();

    // Get session from NextAuth
    const session = await getServerSession(authOptions);
    console.log("here is user profile",session);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId: string = session.user.id;

    // Fetch full user profile
    const user = await User.findById(userId)
      .select("-password -__v")
      .populate({ path: "savedMonasteries", select: "name district state images" })
      .populate({ path: "bookings", populate: { path: "event", select: "eventName startDate ticketPrice" } })
      .populate({ path: "BookedEvents", select: "eventName startDate ticketPrice" })
      .lean()
      .exec();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
        {
          success: true,
          user,
        },
        { status: 200 }
      );
  } catch (error) {
    console.error("Error fetching user profile:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
