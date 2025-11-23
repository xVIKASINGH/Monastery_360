import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGO_URI!
if (!MONGODB_URI) {
    throw new Error("Please add your MONGODB URI to .env.local")
}
async function dbConnect() {
    return mongoose.connect(MONGODB_URI);
}
export default dbConnect;