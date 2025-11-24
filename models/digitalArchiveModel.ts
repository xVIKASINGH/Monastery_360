import mongoose, { Schema, Document } from "mongoose";

export interface IDigitalArchive extends Document {
  monasteryId: mongoose.Types.ObjectId;
  type: string;
  fileUrl: string;
  description: string;
  category: string;
  language: string;
}

const DigitalArchiveSchema = new Schema<IDigitalArchive>(
  {
    monasteryId: { type: Schema.Types.ObjectId, ref: "Monastery" },
    type: String,
    fileUrl: String,
    description: String,
    category: String,
    language: String,
  },
  { timestamps: true }
);

export default mongoose.models.DigitalArchive ||
  mongoose.model<IDigitalArchive>("DigitalArchive", DigitalArchiveSchema);
