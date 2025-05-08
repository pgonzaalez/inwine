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
        $key = env('STRIPE_SECRET');

        if (!$key) {
            return response()->json(['error' => 'Stripe API key is missing.'], 500);
        }

        Stripe::setApiKey($key);

        try {
            $request->validate([
                'orderIds' => 'required|array',
            ]);

            $orderIds = $request->orderIds;
            
            $totalAmount = 0;
            
            $allOrderDetails = [];
            
            foreach ($orderIds as $orderId) {
                $order = DB::table('orders')->where('id', $orderId)->first();
                
                if (!$order) {
                    return response()->json(['error' => "Order with ID $orderId not found"], 404);
                }
                
                $requestRestaurant = DB::table('request_restaurants')
                    ->where('id', $order->request_restaurant_id)
                    ->first();
                
                if (!$requestRestaurant) {
                    return response()->json(['error' => "Request restaurant for order $orderId not found"], 404);
                }
                
                $product = DB::table('products')
                    ->where('id', $requestRestaurant->product_id)
                    ->first();
                
                $orderPrice = $requestRestaurant->price_restaurant;
                $quantity = $requestRestaurant->quantity;
                $orderTotal = $orderPrice * $quantity;
                $totalAmount += $orderTotal;
                
                $allOrderDetails[] = [
                    'order_id' => $orderId,
                    'product_name' => $product ? $product->name : "Producto #" . $requestRestaurant->product_id,
                    'price' => $orderPrice,
                    'quantity' => $quantity,
                    'total' => $orderTotal
                ];
            }
            
            if ($totalAmount <= 0) {
                return response()->json(['error' => 'No valid orders found or total amount is zero'], 400);
            }
            
            $shippingCost = ($totalAmount > 100) ? 0 : 5.0;
            $totalAmount += $shippingCost;
            
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

            foreach ($orderIds as $orderId) {
                Payment::create([
                    'order_id' => $orderId,
                    'stripe_payment_intent_id' => $paymentIntent->id,
                    'status' => $paymentIntent->status,
                    'amount' => $amountInCents, 
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
            Log::error('Payment intent creation failed: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return response()->json([
                'error' => 'Payment intent creation failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}