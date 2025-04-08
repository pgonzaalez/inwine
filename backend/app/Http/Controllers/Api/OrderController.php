<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderRequested;


class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::all();
        return response()->json($orders);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'request_restaurant_id' => 'required|exists:request_restaurants,id',
        ]);

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
        $validated = $request->validate([
            'user_id' => 'sometimes|required|exists:users,id',
            'request_restaurant_id' => 'sometimes|required|exists:request_restaurants,id',
        ]);
        $order->update($validated);
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
        $order->delete();
        return response()->json(['message' => 'Order deleted successfully.']);
    }

    /**
     * Display a listing of the resource by user.
     */

    public function showOrderByUser($userId)
    {
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
                    ],
                    'seller_name' => $seller->name ?? null,
                    'restaurant_name' => $restaurantUser->name ?? null,
                ];
            });

        return response()->json($orders);
    }


    public function completed($orderId)
    {
        $order = Order::where('order_id', $orderId)
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found.'], 404);
        }

        OrderRequested::create([
            'user_id' => $order->user_id,
            'request_restaurant_id' => $order->request_restaurant_id,
            'status' => 'paid',
            'total_price' => $order->requestRestaurant->price_restaurant * 2,
        ]);



        return response()->json(['message' => 'Order marked as completed.']);
    }
}
