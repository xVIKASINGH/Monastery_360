import mongoose, { Document, Model, Schema } from "mongoose";
export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
    savedMonasteries: string[];
  bookings: string[]; // booking history
  createdAt?: Date;
  updatedAt?: Date;
  type:"user" | "hotelier" | "monasteryAdmin";
}
const UserSchema: Schema<IUser> = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
      savedMonasteries: [
      { type: Schema.Types.ObjectId, ref: "Monastery" },
    ],
    bookings: [
      { type: Schema.Types.ObjectId, ref: "Booking" }, // <— add this
    ],

  },
  {
    timestamps: true,
  }
);
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
