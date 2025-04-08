import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { amount, currency } = await request.json();

    console.log(
      "Creating payment intent with amount:",
      amount,
      "currency:",
      currency
    );

    // Make sure amount is a valid number
    const parsedAmount = parseInt(amount, 10);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount provided" },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: parsedAmount,
      currency,
      automatic_payment_methods: { enabled: true },
    });

    console.log("Payment intent created:", paymentIntent.id);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      message: "Payment intent created successfully",
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      {
        error:
          error.message ||
          "An error occurred while creating the payment intent",
      },
      { status: 500 }
    );
  }
}
