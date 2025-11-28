import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  monasteryId: mongoose.Types.ObjectId;
  eventName: string;
  startDate: string;
  endDate?: string;
  time?: string;
  duration?: string;
  location?: string;
  description?: string;
  highlights?: string[];
  images?: string[];
  bookingAvailable: boolean;
  ticketPrice?: number;
}
const EventSchema = new Schema<IEvent>(
  {
    monasteryId: { type: Schema.Types.ObjectId, ref: "Monastery" },
       eventName: String,
    startDate: String,
    endDate: String,
    time: String,
    duration: String,
    location: String,
    description: String,
    highlights: String,
    images: String,
    bookingAvailable: Boolean,
    ticketPrice: Number,
  },
  { timestamps: true }
);

export default mongoose.models.Event ||
  mongoose.model<IEvent>("Event", EventSchema);
