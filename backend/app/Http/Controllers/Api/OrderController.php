<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderRequested;
use App\Models\Payment;
use Illuminate\Support\Facades\Log;
use Stripe\Stripe;
use Stripe\PaymentIntent;


class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::where('user_id', auth()->id())->get();
        return response()->json($orders);
    }

    public function clearForUser(Request $request, $userId)
    {
        if ((int) $userId !== auth()->id()) {
            return response()->json(['message' => 'No estás autorizado'], 403);
        }

        $orderIds = $request->selectedOrderIds ?? [];

        Order::where('user_id', $userId)
            ->whereIn('id', $orderIds)
            ->delete();

        Log::info('Carrito vaciado', ['user_id' => $userId, 'order_ids' => $orderIds]);

        return response()->json(['message' => 'Cart cleared']);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'request_restaurant_id' => 'required|exists:request_restaurants,id',
        ]);
        $validated['user_id'] = auth()->id();

        $existOrder = Order::where('user_id', $validated['user_id'])
            ->where('request_restaurant_id', $validated['request_restaurant_id'])
            ->first();
        if ($existOrder) {
            return response()->json([
                'message' => 'Ja existeix una petició feta per aquest restaurant.',
                'data' => $existOrder
            ], 409);
        }

        $order = Order::create($validated);

        Log::info('Pedido creado', ['order_id' => $order->id, 'user_id' => $order->user_id, 'request_restaurant_id' => $order->request_restaurant_id]);

        return response()->json([
            'message' => 'Orden creada exitosament.',
            'data' => $order
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['message' => 'Order not found.'], 404);
        }
        if ($order->user_id !== auth()->id()) {
            return response()->json(['message' => 'No estás autorizado para ver esta orden'], 403);
        }
        return response()->json($order);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['message' => 'Order not found.'], 404);
        }
        if ($order->user_id !== auth()->id()) {
            return response()->json(['message' => 'No estás autorizado para modificar esta orden'], 403);
        }
        $validated = $request->validate([
            'request_restaurant_id' => 'sometimes|required|exists:request_restaurants,id',
        ]);
        $order->update($validated);

        Log::info('Pedido actualizado', ['order_id' => $order->id, 'user_id' => auth()->id()]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['message' => 'Order not found.'], 404);
        }
        if ($order->user_id !== auth()->id()) {
            return response()->json(['message' => 'No estás autorizado para eliminar esta orden'], 403);
        }
        $orderId = $order->id;
        $order->delete();

        Log::info('Pedido eliminado', ['order_id' => $orderId, 'user_id' => auth()->id()]);

        return response()->json(['message' => 'Order deleted successfully.']);
    }

    /**
     * Display a listing of the resource by user.
     */

    public function showOrderByUser($userId)
    {
        if ((int) $userId !== auth()->id()) {
            return response()->json(['message' => 'No estás autorizado'], 403);
        }

        $orders = Order::where('user_id', $userId)
            ->with([
                'requestRestaurant.product.seller',
                'requestRestaurant.user',
            ])
            ->get()
            ->map(function ($order) {
                $product = $order->requestRestaurant->product;
                $seller = $product->seller;
                $restaurantUser = $order->requestRestaurant->user;

                return [
                    'order_id' => $order->id,
                    'user_id' => $order->user_id,
                    'request_restaurant_id' => $order->request_restaurant_id,
                    'price_restaurant' => $order->requestRestaurant->price_restaurant,
                    'quantity' => $order->requestRestaurant->quantity,
                    'product' => [
                        'name' => $product->name,
                        'origin' => $product->origin,
                        'year' => $product->year,
                        'image' => $product->image,
                        'price_demanded' => $product->price_demanded,
                    ],
                    'seller_name' => $seller->name ?? null,
                    'restaurant_name' => $restaurantUser->name ?? null,
                ];
            });

        return response()->json($orders);
    }


    public function completed($orderId)
    {
        $order = Order::find($orderId);

        if (!$order) {
            return response()->json(['message' => 'Order not found.'], 404);
        }

        if ($order->user_id !== auth()->id()) {
            return response()->json(['message' => 'No estás autorizado para completar esta orden'], 403);
        }

        // No hay webhook de Stripe todavía, así que esto es lo único que
        // impide marcar un pedido como pagado sin haberlo pagado de verdad:
        // se comprueba contra Stripe (no contra lo que guardamos nosotros en
        // la tabla payments, que se queda con el estado de cuando se creó el
        // PaymentIntent, antes de que el cliente confirme el pago) que el
        // PaymentIntent asociado a esta orden está realmente en 'succeeded'.
        $payment = Payment::where('order_id', $orderId)->latest('id')->first();

        if (!$payment || !$payment->stripe_payment_intent_id) {
            return response()->json(['message' => 'No se encontró ningún pago para esta orden.'], 402);
        }

        $key = config('services.stripe.secret');
        if (!$key) {
            return response()->json(['message' => 'Stripe API key is missing.'], 500);
        }

        try {
            Stripe::setApiKey($key);
            $paymentIntent = PaymentIntent::retrieve($payment->stripe_payment_intent_id);
        } catch (\Exception $e) {
            Log::error('No se pudo verificar el PaymentIntent con Stripe', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'No se pudo verificar el pago con Stripe.'], 502);
        }

        if ($paymentIntent->status !== 'succeeded') {
            return response()->json([
                'message' => 'El pago todavía no se ha completado.',
                'stripe_status' => $paymentIntent->status,
            ], 402);
        }

        if ($payment->status !== $paymentIntent->status) {
            $payment->status = $paymentIntent->status;
            $payment->save();
        }

        try {
            $requestRestaurant = $order->requestRestaurant;
            if (!$requestRestaurant) {
                return response()->json(['message' => 'RequestRestaurant not found for this order.'], 404);
            }

            $order->delete();

            OrderRequested::create([
                'user_id' => $order->user_id,
                'request_restaurant_id' => $order->request_restaurant_id,
                'status' => 'paid', 
                'total_price' => $requestRestaurant->price_restaurant * $requestRestaurant->quantity, 
            ]);

            $requestRestaurant->status = 'accepted'; 
            $requestRestaurant->save();

            $product = $requestRestaurant->product;
            if ($product) {
                $product->status = 'requested';
                $product->save();
            }

            // El email es una cortesía informativa, nunca debe poder tumbar
            // la respuesta de "pedido completado" si Resend falla o no está
            // configurado todavía.
            try {
                $restaurantUser = $order->user;
                if ($restaurantUser) {
                    $restaurantUser->notify(new \App\Notifications\OrderPaymentConfirmed(
                        productName: $product->name ?? 'Producte',
                        quantity: $requestRestaurant->quantity,
                        unitPrice: $requestRestaurant->price_restaurant,
                        totalPrice: $requestRestaurant->price_restaurant * $requestRestaurant->quantity,
                        orderReference: $order->id,
                    ));
                }
            } catch (\Exception $e) {
                Log::error('No se pudo enviar el email de confirmación de pago', ['error' => $e->getMessage()]);
            }

            Log::info('Pago confirmado y pedido completado', [
                'order_id' => $orderId,
                'user_id' => $order->user_id,
                'product_id' => $product->id ?? null,
                'total_price' => $requestRestaurant->price_restaurant * $requestRestaurant->quantity,
            ]);

            return response()->json(['message' => 'Order marked as completed.']);
        } catch (\Exception $e) {
            Log::error('Error al completar pedido', ['order_id' => $orderId, 'error' => $e->getMessage()]);
            return response()->json(['message' => 'Failed to mark order as completed.', 'error' => $e->getMessage()], 500);
        }
    }
}
