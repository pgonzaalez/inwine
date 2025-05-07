<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RequestRestaurant;
use Illuminate\Http\Request;

class RequestRestaurantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $request = RequestRestaurant::all();
        return response()->json($request);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validar los datos de entrada
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'price_restaurant' => 'required|numeric|min:0',
        ]);

        // Crear un nuevo registro en la tabla RequestRestaurant
        $requestRestaurant = RequestRestaurant::create($validated);

        return response()->json([
            'message' => 'Solicitud del restaurante creada con Ã©xito.',
            'data' => $requestRestaurant
        ], status: 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $request = RequestRestaurant::find($id);
        return response()->json($request);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request = RequestRestaurant::find($id);
        $request->update($request->all());
        return response()->json($request);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $request = RequestRestaurant::find($id);
        $request->delete();
        return response()->json($request);
    }

    public function indexByRestaurant($userId)
    {
        $products = RequestRestaurant::where('user_id', $userId)
            ->with('product')
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
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

    public function showRequestWithProduct($userId, $requestId)
    {
        $request = RequestRestaurant::where('user_id', $userId)
            ->where('id', $requestId)
            ->with(['product.wineType', 'product.images'])
            ->first();
    
        if (!$request) {
            return response()->json(['error' => 'Request not found'], 404);
        }
    
        $product = $request->product;
    
        $result = [
            'id' => $request->id,
            'user_id' => $request->user_id,
            'product_id' => $request->product_id,
            'quantity' => $request->quantity,
            'price_restaurant' => $request->price_restaurant,
            'status' => $request->status,
            'created_at' => $request->created_at,
            'updated_at' => $request->updated_at,
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'origin' => $product->origin,
                'year' => $product->year,
                'wine_type' => $product->wineType->name ?? null,
                'price_demanded' => $product->price_demanded,
                'image' => $product->image,
                'images' => $product->images->map(function ($image) {
                    return [
                        'id' => $image->id,
                        'image_path' => $image->image_path,
                        'is_primary' => $image->is_primary,
                        'order' => $image->order,
                    ];
                }),
            ],
        ];
    
        return response()->json($result);
    }
    

    public function searchByProduct(string $id)
    {
        $request = RequestRestaurant::where('product_id', $id)
            ->where('status', 'pending')
            ->get();
        return response()->json($request);
    }
}
