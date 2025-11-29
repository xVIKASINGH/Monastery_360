import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/uploadCloudinary"; 
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";// NOTE: Replace with your actual MongoDB model and connection logic
// import EventModel from '@/models/EventModel'; 
import eventsModel from "@/models/eventsModel";
import User from "@/models/User";
// --- Interface Definitions for API Consistency ---

interface EventSchema {
    _id: string; // MongoDB ID
    monasteryId: string;
    eventName: string;
    startDate: string;
    endDate: string;
    time: string;
    duration: string;
    location: string;
    description: string;
    highlights: string;
    images: string[]; // CORRECTED to match your model name
    bookingAvailable: boolean;
    ticketPrice: number;
    totaltickets: number;
    createdAt: Date;
}


export async function POST(req: NextRequest) {
     const session = await getServerSession(authOptions);
    try {
        const formData = await req.formData();

        // 2. Extract Fields and Files
        const eventName = formData.get('eventName') as string;
        const monasteryId = formData.get('monasteryId') as string;
        const description = formData.get('description') as string;
        const highlights = formData.get('highlights') as string;
        const startDate = formData.get('startDate') as string;
        const endDate = formData.get('endDate') as string;
        const time = formData.get('time') as string;
        const duration = formData.get('duration') as string;
        const location = formData.get('location') as string;
        
        // Parsing non-string fields
        const bookingAvailable = formData.get('bookingAvailable') === 'true'; 
        const ticketPrice = parseFloat(formData.get('ticketPrice') as string) || 0;
        const totaltickets = parseInt(formData.get('totaltickets') as string, 10) || 0;

        const imageFiles = formData.getAll('images') as File[];

        if (!monasteryId || !eventName || !startDate) {
            return NextResponse.json({ success: false, message: "Missing required fields." }, { status: 400 });
        }
        
        // 3. Upload Images to Cloudinary
        console.log(`Uploading ${imageFiles.length} images to Cloudinary...`);
        
        const uploadPromises = imageFiles.map(file => uploadToCloudinary(file));

        // Use Promise.allSettled to handle individual file upload failures gracefully
        const uploadResults = await Promise.allSettled(uploadPromises);

        const successfulUploads: string[] = [];
        uploadResults.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                successfulUploads.push(result.value);
            } else {
                console.error(`Upload failed for image ${index}:`, result.reason);
                // Optionally handle the failure by sending a specific message back
            }
        });
        
        if (imageFiles.length > 0 && successfulUploads.length === 0) {
            // If the user uploaded images but all uploads failed
             return NextResponse.json({ success: false, message: "Image upload failed. Cannot create event." }, { status: 500 });
        }

        console.log(`Cloudinary upload complete. ${successfulUploads.length} URLs generated.`);

        // 4. Prepare Event Data for DB
        const eventDataToSave: Omit<EventSchema, '_id' | 'createdAt'> = {
            monasteryId,
            eventName,
            startDate,
            endDate,
            time,
            duration,
            location,
            description,
            highlights,
            images: successfulUploads, // CORRECTED FIELD NAME & Data type (Array of strings)
            bookingAvailable,
            ticketPrice,
            totaltickets,
        };

        // 5. Save to Database
        const savedEvent = await eventsModel.create(eventDataToSave); 
        console.log("Event saved to DB with ID:", savedEvent);
         await User.findByIdAndUpdate(
  session?.user.id,
  { $push: { bookings: savedEvent._id } },
  { new: true }
);

        return NextResponse.json({ 
            success: true, 
            message: "Event created successfully.", 
            event: savedEvent 
        }, { status: 201 });

    } catch (error) {
        console.error("API Error during event creation:", error);
        // The ValidationError Mongoose is throwing originates from the data passed to it
        // The fix above ensures the `images` field is always an array of strings.
        return NextResponse.json({ 
            success: false, 
            message: "Internal server error. Check server logs for validation/upload details."
        }, { status: 500 });
    }
}