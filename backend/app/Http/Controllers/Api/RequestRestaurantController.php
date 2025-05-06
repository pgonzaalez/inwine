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

    public function showProductByRestaurant($userId, $productId)
    {
        $request = RequestRestaurant::where('user_id', $userId)
            ->where('product_id', $productId)
            ->with('product.wineType') // Asegúrate de incluir wineType en el with
            ->first();

        if (!$request) {
            return response()->json(['error' => 'Request not found'], 404);
        }

        $result = [
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
