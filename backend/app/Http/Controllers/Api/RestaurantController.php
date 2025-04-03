<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Restaurant;
use App\Models\RequestRestaurant;

class RestaurantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $restaurant = Restaurant::all();
        return response()->json($restaurant);
    }

    public function indexByRestaurant($userId)
    {
        $products = RequestRestaurant::where('user_id', $userId)
            ->with('product')
            ->get()
            ->map(function ($request) {
                return [
                    'price_restaurant' => $request->price_restaurant,
                    'status' => $request->status,
                    'created_at' => $request->created_at,
                    'product' => [
                        'id' => $request->product->id,
                        'name' => $request->product->name,
                        'origin' => $request->product->origin,
                        'year' => $request->product->year,
                        'wine_type' => $request->product->wineType->name ?? null,
                        'price_demanded' => $request->product->price_demanded,
                        'quantity' => $request->quantity,
                        'image' => $request->product->image,
                    ],
                ];
            });

        return response()->json($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $restaurant = Restaurant::create($request->all());
        return response()->json($restaurant);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $restaurant = Restaurant::find($id);
        return response()->json($restaurant);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $restaurant = Restaurant::find($id);
        $restaurant->update($request->all());
        return response()->json($restaurant);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $restaurant = Restaurant::find($id);
        $restaurant->delete();
        return response()->json($restaurant);
    }

    public function searchByProduct(string $id)
    {
        $request = RequestRestaurant::where('product_id', $id)
            ->where('status', 'pending')
            ->get();
        return response()->json($request);
    }
}
