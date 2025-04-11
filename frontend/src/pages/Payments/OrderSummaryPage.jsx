import { useSearchParams, useNavigate } from "react-router-dom"

export default function OrderSummaryPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Get the payment_intent and payment_intent_client_secret from the URL
  const paymentIntent = searchParams.get("payment_intent")
  const paymentIntentClientSecret = searchParams.get("payment_intent_client_secret")
  const redirectStatus = searchParams.get("redirect_status")

  // Determine payment status based on URL parameters
  // Stripe only redirects with these parameters on successful payment
  const isPaymentSuccessful = paymentIntent && paymentIntentClientSecret && redirectStatus === "succeeded"

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold">Resum de la comanda</h1>
        </div>

        <div className="content">
          {isPaymentSuccessful ? (
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-green-500 mx-auto mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="text-lg font-medium text-green-800">Pagament completat amb èxit!</h3>
                <p className="text-green-600 mt-1">Gràcies per la seva compra</p>
              </div>

              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID de pagament:</span>
                  <span className="font-medium">{paymentIntent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data:</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={() => navigate("/productes")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition duration-200"
                >
                  Tornar a l'inici
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="bg-red-50 p-4 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-red-500 mx-auto mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-red-800">Error en processar el pagament</h3>
                <p className="text-red-600 mt-1">Si us plau, intenti-ho de nou més tard</p>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => navigate("/checkout")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition duration-200"
                >
                  Tornar al pagament
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


