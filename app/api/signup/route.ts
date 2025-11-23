import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnnect";
import User from "@/models/User";
import bcrypt from "bcrypt";
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, username, password } = await req.json();
    const existingUser = await User.findOne({ email });    
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      email,
      username,
      password: hashedPassword,
    });
    return NextResponse.json({ message: "Signup success" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Signup error" }, { status: 500 });
  }
}
