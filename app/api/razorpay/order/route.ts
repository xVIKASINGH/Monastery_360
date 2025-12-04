import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_TEST_KEY_ID!,
  key_secret: process.env.RAZORPAY_TEST_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { amount, currency = "INR", receipt } = await req.json();

    const options = {
      amount: amount * 100, // amount in paise
      currency,
      receipt: receipt || "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(order);
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json(
      { error: "Unable to create order" },
      { status: 500 }
    );
  }
}
