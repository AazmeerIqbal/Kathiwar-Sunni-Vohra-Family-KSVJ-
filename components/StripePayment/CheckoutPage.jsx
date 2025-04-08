"use client";
import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

const CheckoutPage = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  console.log("amount in checkout page:", amount);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage("Stripe hasn't loaded yet. Please try again.");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${
          window.location.origin
        }/financial-statistics/payment-success?amount=${amount / 100}`,
      },
    });

    if (error) {
      setErrorMessage(error.message || "Payment failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
      <button
        disabled={!stripe || loading}
        className="mt-6 text-purple-700 font-bold py-2 px-6 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-all"
        type="submit"
      >
        {loading
          ? "Processing..."
          : `Pay ${parseFloat(amount / 100).toLocaleString()} PKR`}
      </button>
    </form>
  );
};

export default CheckoutPage;
