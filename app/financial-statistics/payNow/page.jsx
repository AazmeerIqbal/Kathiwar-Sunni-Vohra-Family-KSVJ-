"use client";
import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "@/components/StripePayment/CheckoutPage";
import { convertToPesa } from "@/utils/ConvertToPesa";
import PageUnderConstruction from "@/components/ui/PageUnderConstruction";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const Page = () => {
  const initialAmount =
    new URLSearchParams(window.location.search).get("balance") || "0";
  const [amount, setAmount] = useState(convertToPesa(initialAmount));
  const [customAmount, setCustomAmount] = useState("");
  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState(null);

  // Fetch clientSecret whenever amount changes
  // inside your Page component
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const res = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: amount, currency: "pkr" }),
        });

        if (!res.ok) throw new Error("Failed to create payment intent");

        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error("Error creating payment intent:", err);
      }
    };

    createPaymentIntent();
  }, [amount]);

  const handleCustomAmount = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(customAmount);

    if (isNaN(parsedAmount)) {
      setError("Please enter a valid amount");
      return;
    }

    if (parsedAmount < 100) {
      setError("Minimum amount is 100 PKR");
      return;
    }

    setAmount(convertToPesa(customAmount));
    console.log(amount);
    setError("");
  };

  const appearance = { theme: "stripe" };
  const options = { clientSecret, appearance };

  return (
    // <div className="max-w-3xl mx-auto p-8 text-center rounded-xl shadow-lg bg-indigo-600/50 bg-gradient-to-br from-indigo-500/50 via-purple-500/50 to-indigo-600/50 m-6 border border-indigo-400 drop-shadow-2xl">
    //   <h1 className="font-bold text-2xl md:text-4xl text-white mb-3">
    //     Pay Now
    //   </h1>
    //   <span className="text-white text-lg bg-indigo-700/40 px-4 py-1 rounded-full inline-block mb-6">
    //     Balance Due = {amount / 100} PKR
    //   </span>

    //   {/* Custom Amount Form */}
    //   <div className="bg-white/20 p-4 rounded-lg mb-6">
    //     <form
    //       onSubmit={handleCustomAmount}
    //       className="flex flex-col md:flex-row gap-2 items-center justify-center"
    //     >
    //       <div className="flex-1">
    //         <input
    //           type="number"
    //           value={customAmount}
    //           onChange={(e) => setCustomAmount(e.target.value)}
    //           placeholder="Custom amount (min. 100 PKR)"
    //           className="w-full px-4 py-2 rounded-md border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
    //           step="0.01"
    //           min="100"
    //         />
    //       </div>
    //       <button
    //         type="submit"
    //         className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-md transition-colors"
    //       >
    //         Update Amount
    //       </button>
    //     </form>
    //     {error && <p className="text-red-200 mt-2 text-sm">{error}</p>}
    //   </div>

    //   {/* Stripe Form */}
    //   <div className="bg-white p-6 rounded-lg shadow-md">
    //     {clientSecret ? (
    //       <Elements stripe={stripePromise} options={{ clientSecret }}>
    //         <CheckoutPage amount={amount} />
    //       </Elements>
    //     ) : (
    //       <div className="text-center">Initializing payment form...</div>
    //     )}
    //   </div>
    // </div>
    <PageUnderConstruction />
  );
};

export default Page;
