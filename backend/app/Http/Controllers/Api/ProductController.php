<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $product = Product::all();
        return response()->json($product);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'origin' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'wine_type_id' => 'required|exists:wine_types,id',
            'description' => 'nullable|string',
            'price_demanded' => 'required|decimal:0,2|min:0',
            'quantity' => 'required|integer|min:0',
            'image' => 'nullable|url|max:255',
            'seller_id' => 'required|exists:sellers,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $product = Product::create($request->all());
            Log::info('Producto creado exitosamente', ['product_id' => $product->id, 'product_data' => $product]);
        } catch (\Exception $e) {
            Log::error('Error al crear el producto', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el producto'
            ], 500);
        }

        // Respuesta exitosa
        return response()->json([
            'success' => true,
            'data' => $product
        ], 201);
    }
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::find($id);
        return response()->json($product);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::find($id);
        $product->update($request->all());
        return response()->json($product);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Producto no encontrado'
            ], 404);
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Producto eliminado correctamente'
        ]);
    }
}
