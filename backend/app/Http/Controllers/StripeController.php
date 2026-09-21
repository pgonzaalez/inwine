<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use App\Models\Commission;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class StripeController extends Controller
{
    // Recàrrec per cobrir la comissió que Stripe cobra a la plataforma per
    // processar el pagament. No és configurable des del panell perquè no és
    // una comissió de negoci, és el cost del propi processador de pagaments.
    private const STRIPE_FEE_PERCENTAGE = 3.0;

    public function createPaymentIntent(Request $request)
    {
        $key = config('services.stripe.secret');

        if (!$key) {
            return response()->json(['error' => 'Stripe API key is missing.'], 500);
        }

        Stripe::setApiKey($key);

        try {
            $request->validate([
                'orderIds' => 'required|array',
                'orderIds.*' => 'integer',
            ]);

            $orderIds = $request->orderIds;

            // Comissió que paga el restaurant en fer la comanda (percentatge
            // "Comissió pel restaurant" configurat al panell d'administració).
            // És independent de la comissió que es descompta al celler i de la
            // que es descompta a l'inversor: cada part té la seva pròpia fila
            // a la taula commissions. Si s'esborra la fila, no es bloqueja el
            // cobrament, simplement no s'afegeix cap recàrrec per aquest concepte.
            $restaurantCommissionPercentage = (float) (Commission::where('name', 'Comissió pel restaurant')->value('percentage') ?? 0);

            // El importe a cobrar se calcula SIEMPRE a partir de lo que hay
            // guardado en base de datos (price_restaurant * quantity). No se
            // usa ningún precio recibido del cliente: aceptarlo permitiría a
            // cualquiera pagar lo que quisiera por un pedido.
            $totalAmount = 0;
            $totalRestaurantCommission = 0;

            $allOrderDetails = [];

            foreach ($orderIds as $orderId) {
                $order = DB::table('orders')->where('id', $orderId)->first();

                if (!$order) {
                    return response()->json(['error' => "Order with ID $orderId not found"], 404);
                }

                if ((int) $order->user_id !== auth()->id()) {
                    return response()->json(['error' => "No tienes permiso sobre la orden $orderId"], 403);
                }

                $requestRestaurant = DB::table('request_restaurants')
                    ->where('id', $order->request_restaurant_id)
                    ->first();

                if (!$requestRestaurant || $requestRestaurant->price_restaurant === null) {
                    return response()->json(['error' => "Request restaurant for order $orderId not found"], 404);
                }

                $product = DB::table('products')
                    ->where('id', $requestRestaurant->product_id)
                    ->first();

                $orderPrice = (float) $requestRestaurant->price_restaurant;
                $quantity = $requestRestaurant->quantity;
                $orderTotal = $orderPrice * $quantity;
                $restaurantCommission = round($orderTotal * $restaurantCommissionPercentage / 100, 2);

                $totalAmount += $orderTotal;
                $totalRestaurantCommission += $restaurantCommission;

                $allOrderDetails[] = [
                    'order_id' => $orderId,
                    'product_name' => $product ? $product->name : "Producto #" . $requestRestaurant->product_id,
                    'price' => $orderPrice,
                    'quantity' => $quantity,
                    'total' => $orderTotal,
                    'restaurant_commission' => $restaurantCommission,
                ];
            }

            if ($totalAmount <= 0) {
                return response()->json(['error' => 'No valid orders found or total amount is zero'], 400);
            }

            // Comissió pel restaurant (percentatge configurat al panell).
            $totalAmount += $totalRestaurantCommission;

            // Recàrrec de Stripe: es calcula sobre el que ja s'ha carregat
            // (producte + comissió del restaurant), no sobre les despeses
            // d'enviament, que s'afegeixen després.
            $stripeFee = round($totalAmount * self::STRIPE_FEE_PERCENTAGE / 100, 2);
            $totalAmount += $stripeFee;

            // De moment l'enviament és sempre gratuït.
            $shippingCost = 0;
            $totalAmount += $shippingCost;

            $amountInCents = (int) round($totalAmount * 100);

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
                'restaurantCommission' => $totalRestaurantCommission,
                'stripeFee' => $stripeFee,
                'shippingCost' => $shippingCost,
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