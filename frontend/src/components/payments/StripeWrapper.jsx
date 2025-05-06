"use client"

import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import CheckoutForm from "./CheckoutForm"
import { useEffect, useState } from "react"

// Make sure to add your publishable key to your environment variables
const apiUrl = import.meta.env.VITE_API_URL
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

export default function StripeWrapper() {
  const [clientSecret, setClientSecret] = useState(null)
  const [orderDetails, setOrderDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Get the orderIds from localStorage
    const orderIdsString = localStorage.getItem("currentOrderIds");

    if (!orderIdsString) {
      console.error("No order IDs found in localStorage");
      setError("No order IDs found");
      setLoading(false);
      return;
    }

    let orderIds;
    try {
      orderIds = JSON.parse(orderIdsString);
      if (!Array.isArray(orderIds)) {
        throw new Error("Invalid order IDs format");
      }

      // Filter out null or invalid IDs
      orderIds = orderIds.filter((id) => id !== null && id !== undefined);

      if (orderIds.length === 0) {
        throw new Error("No valid order IDs found");
      }
    } catch (e) {
      console.error("Error parsing or validating order IDs:", e.message);
      setError("Invalid order IDs");
      setLoading(false);
      return;
    }

    console.log("Valid Order IDs being sent to API:", orderIds);

    // Create PaymentIntent as soon as the page loads
    fetch(`${apiUrl}/v1/create-payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ orderIds }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Server responded with ${res.status}: ${errorText}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.clientSecret) {
          setClientSecret(data.clientSecret);
          setOrderDetails(data.orderDetails);
        } else {
          throw new Error("Invalid response format: missing clientSecret");
        }
      })
      .catch((error) => {
        console.error("Error fetching client secret:", error.message);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const appearance = { theme: "stripe" }
  const options = { clientSecret, appearance }

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto p-8 flex justify-center">
        <div className="w-12 h-12 border-4 border-[#8c4a5a] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {clientSecret && (
        <>
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm />
          </Elements>
        </>
      )}
    </div>
  )
}