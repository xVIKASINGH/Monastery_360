import mongoose, { Schema, Document } from "mongoose";

export interface IMonastery extends Document {
  name: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  district: string;
  images: string[];
  history: string;
  architecture: string;
  foundedYear: number;
  nearbyAttractions: string[];
}

const MonasterySchema = new Schema<IMonastery>(
  {
    name: { type: String, required: true },
    description: String,
    location: {
      lat: Number,
      lng: Number,
    },
    district: String,
    images: [String],
    history: String,
    architecture: String,
    foundedYear: Number,
    nearbyAttractions: [String],
  },
  { timestamps: true }
);

export default mongoose.models.Monastery ||
  mongoose.model<IMonastery>("Monastery", MonasterySchema);
