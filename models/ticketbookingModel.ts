import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId; // or string
  monastery: mongoose.Types.ObjectId; // or string
  date: Date;
  numberOfPeople: number;
  ticketPrice: number;
  totalAmount: number;
  paymentStatus: "pending" | "success" | "failed";
}

const BookingSchema = new Schema<IBooking>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  monastery: {
    type: Schema.Types.ObjectId,
    ref: "Monastery",
    required: true
  },
  date: { type: Date, required: true },
  numberOfPeople: { type: Number, required: true },
  ticketPrice: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending"
  }
});

export default mongoose.model<IBooking>("Booking", BookingSchema);
