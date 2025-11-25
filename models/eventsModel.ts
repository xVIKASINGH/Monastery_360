import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  monasteryId: mongoose.Types.ObjectId;
  eventName: string;
  date: string;
  description: string;
  images: string[];
  bookingAvailable: boolean;
  ticketPrice?: number;
}

const EventSchema = new Schema<IEvent>(
  {
    monasteryId: { type: Schema.Types.ObjectId, ref: "Monastery" },
    eventName: String,
    date: String,
    description: String,
    images: [String],
    bookingAvailable: Boolean,
  },
  { timestamps: true }
);

export default mongoose.models.Event ||
  mongoose.model<IEvent>("Event", EventSchema);
