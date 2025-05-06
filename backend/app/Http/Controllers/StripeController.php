<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class StripeController extends Controller
{
    public function createPaymentIntent(Request $request)
    {
        // Cargar la clave API desde el archivo .env
        $key = env('STRIPE_SECRET');

        if (!$key) {
            return response()->json(['error' => 'Stripe API key is missing.'], 500);
        }

        Stripe::setApiKey($key);

        try {
            // Validar la solicitud
            $request->validate([
                'orderIds' => 'required|array',
            ]);

            $orderIds = $request->orderIds;
            
            // Inicializar el monto total
            $totalAmount = 0;
            
            // Array para almacenar los detalles de todas las órdenes
            $allOrderDetails = [];
            
            // Procesar cada orden
            foreach ($orderIds as $orderId) {
                // Buscar la orden
                $order = DB::table('orders')->where('id', $orderId)->first();
                
                if (!$order) {
                    return response()->json(['error' => "Order with ID $orderId not found"], 404);
                }
                
                // Obtener los detalles del request_restaurant asociado a esta orden
                $requestRestaurant = DB::table('request_restaurants')
                    ->where('id', $order->request_restaurant_id)
                    ->first();
                
                if (!$requestRestaurant) {
                    return response()->json(['error' => "Request restaurant for order $orderId not found"], 404);
                }
                
                // Obtener información del producto
                $product = DB::table('products')
                    ->where('id', $requestRestaurant->product_id)
                    ->first();
                
                // Calcular el precio para esta orden
                // Usamos price_restaurant de la tabla request_restaurants
                $orderPrice = $requestRestaurant->price_restaurant;
                $quantity = $requestRestaurant->quantity;
                
                // El precio total para esta orden es precio * cantidad
                $orderTotal = $orderPrice * $quantity;
                
                // Añadir al total
                $totalAmount += $orderTotal;
                
                // Guardar detalles de la orden
                $allOrderDetails[] = [
                    'order_id' => $orderId,
                    'product_name' => $product ? $product->name : "Producto #" . $requestRestaurant->product_id,
                    'price' => $orderPrice,
                    'quantity' => $quantity,
                    'total' => $orderTotal
                ];
            }
            
            // Si no hay monto total, devolver error
            if ($totalAmount <= 0) {
                return response()->json(['error' => 'No valid orders found or total amount is zero'], 400);
            }
            
            // Añadir gastos de envío si es necesario
            $shippingCost = ($totalAmount > 100) ? 0 : 5.0;
            $totalAmount += $shippingCost;
            
            // Convertir a céntimos y asegurar que sea un entero
            $amountInCents = (int)($totalAmount * 100);
            
            $paymentIntent = PaymentIntent::create([
                'amount' => $amountInCents,
                'currency' => 'eur',
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
                'metadata' => [
                    'order_ids' => implode(',', $orderIds)
                ]
            ]);

            // Guardar el pago en la base de datos para cada orden
            foreach ($orderIds as $orderId) {
                Payment::create([
                    'order_id' => $orderId,
                    'stripe_payment_intent_id' => $paymentIntent->id,
                    'status' => $paymentIntent->status,
                    'amount' => $amountInCents, // El monto total del pago
                    'currency' => $paymentIntent->currency,
                ]);
            }

            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
                'orderDetails' => $allOrderDetails,
                'totalAmount' => $totalAmount,
                'shippingCost' => $shippingCost
            ]);
            
        } catch (\Exception $e) {
            // Registrar el error
            Log::error('Payment intent creation failed: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            // Devolver una respuesta JSON de error adecuada
            return response()->json([
                'error' => 'Payment intent creation failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}