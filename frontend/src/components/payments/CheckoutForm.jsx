import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { useState } from "react"

export default function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()

  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (!stripe || !elements) {
      setIsLoading(false)
      return
    }

    const orderId = localStorage.getItem("currentOrderId")

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-summary`,
        payment_method_data: {
          metadata: {
            order_id: orderId,
          },
        },
      },
    })

    if (error) {
      setMessage(error.message || "An unexpected error occurred.")
    }

    setIsLoading(false)
  }

  return (
    <div className="flex justify-center items-center  px-4 py-20 rounded-lg">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Pagar comanda</h2>

        <div className="mb-4">
          <PaymentElement />
        </div>

        <button
          type="submit"
          disabled={!stripe || isLoading}
          className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition duration-200 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Processant..." : "Pagar ara"}
        </button>

        {message && <div className="mt-4 text-center text-red-500 text-sm">{message}</div>}
      </form>
    </div>
  )
}
