"use client"

import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import CheckoutForm from "./CheckoutForm"
import { useEffect, useState } from "react"

// Make sure to add your publishable key to your environment variables
const apiUrl = import.meta.env.VITE_API_URL;
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

export default function StripeWrapper() {
  const [clientSecret, setClientSecret] = useState(null)

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch(`${apiUrl}/v1/create-payment-intent`, {
      method: "POST",
    })
      .then(async (res) => {
        const text = await res.text();
        return JSON.parse(text);
      })
      .then((data) => setClientSecret(data.clientSecret))
      .catch((error) => console.error("Error fetching client secret:", error))
    
  }, [])

  const appearance = { theme: "stripe" }
  const options = { clientSecret, appearance }

  return (
    <div className="w-full max-w-md mx-auto">
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  )
}