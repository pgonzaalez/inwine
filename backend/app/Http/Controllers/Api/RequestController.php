<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RequestRestaurant;
use Illuminate\Http\Request;

class RequestController extends Controller
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
            'message' => 'Solicitud del restaurante creada con éxito.',
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
}
