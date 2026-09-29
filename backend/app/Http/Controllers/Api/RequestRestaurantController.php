<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\RequestRestaurant;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

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
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'price_restaurant' => 'required|numeric|min:0.01',
        ]);

        // El precio ofrecido nunca puede ser menor que lo que pide el
        // vendedor: la app solo lo impedía en el formulario (frontend), así
        // que llamando directamente a la API se podía crear una solicitud
        // (y luego un pedido/pago) muy por debajo del precio real.
        $product = Product::find($validated['product_id']);
        if ($validated['price_restaurant'] < $product->price_demanded) {
            throw ValidationException::withMessages([
                'price_restaurant' => 'El precio ofrecido no puede ser menor que el precio del producto (' . $product->price_demanded . ').',
            ]);
        }

        $validated['user_id'] = auth()->id();

        // Crear un nuevo registro en la tabla RequestRestaurant
        $requestRestaurant = RequestRestaurant::create($validated);

        Log::info('Solicitud de restaurante creada', [
            'request_restaurant_id' => $requestRestaurant->id,
            'product_id' => $requestRestaurant->product_id,
            'user_id' => $requestRestaurant->user_id,
            'price_restaurant' => $requestRestaurant->price_restaurant,
            'quantity' => $requestRestaurant->quantity,
        ]);

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
    public function update(Request $httpRequest, string $id)
    {
        $requestRestaurant = RequestRestaurant::findOrFail($id);

        if ($requestRestaurant->user_id !== auth()->id()) {
            return response()->json(['message' => 'No estás autorizado para modificar esta solicitud'], 403);
        }

        // Verificar si el producto está en stock
        $product = $requestRestaurant->product;
        if (!$product || $product->status !== 'in_stock') {
            return response()->json([
                'message' => 'No se puede actualizar la solicitud porque el producto no está en stock'
            ], 400);
        }

        $validated = $httpRequest->validate([
            'quantity' => 'sometimes|required|integer|min:1',
            'price_restaurant' => 'sometimes|required|numeric|min:0.01',
        ]);

        $newPrice = $validated['price_restaurant'] ?? $requestRestaurant->price_restaurant;
        if ($newPrice < $product->price_demanded) {
            throw ValidationException::withMessages([
                'price_restaurant' => 'El precio ofrecido no puede ser menor que el precio del producto (' . $product->price_demanded . ').',
            ]);
        }

        $requestRestaurant->update($validated);

        Log::info('Solicitud de restaurante actualizada', [
            'request_restaurant_id' => $requestRestaurant->id,
            'user_id' => auth()->id(),
            'changes' => $validated,
        ]);

        return response()->json($requestRestaurant);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        // Obtener el usuario autenticado mediante el token
        $user = $request->user();

        // Buscar la solicitud
        $requestRestaurant = RequestRestaurant::find($id);

        // Verificar si la solicitud existe
        if (!$requestRestaurant) {
            return response()->json([
                'message' => 'Solicitud no encontrada'
            ], 404);
        }

        // Verificar si la solicitud pertenece al usuario
        if ($requestRestaurant->user_id !== $user->id) {
            return response()->json([
                'message' => 'No estás autorizado para eliminar esta solicitud'
            ], 403);
        }

        // Verificar si el producto está en stock
        $product = $requestRestaurant->product;
        if (!$product || $product->status !== 'in_stock') {
            return response()->json([
                'message' => 'No se puede eliminar la solicitud porque el producto no está en stock'
            ], 400);
        }

        // Eliminar la solicitud
        $requestRestaurantId = $requestRestaurant->id;
        $requestRestaurant->delete();

        Log::info('Solicitud de restaurante eliminada', ['request_restaurant_id' => $requestRestaurantId, 'user_id' => $user->id]);

        return response()->json([
            'message' => 'Solicitud eliminada correctamente',
            'data' => $requestRestaurant
        ]);
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
                    'quantity' => $request->quantity,
                    'status' => $request->status,
                    'created_at' => $request->created_at,
                    'product' => [
                        'id' => $request->product->id,
                        'name' => $request->product->name,
                        'origin' => $request->product->origin,
                        'year' => $request->product->year,
                        'wine_type' => $request->product->wineType->name ?? null,
                        'price_demanded' => $request->product->price_demanded,
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

        return response()->json([
            'id' => $request->id,
            'user_id' => $request->user_id,
            'product_id' => $request->product_id,
            'quantity' => $request->quantity,
            'price_restaurant' => $request->price_restaurant,
            'status' => $request->status,
            'created_at' => $request->created_at,
            'updated_at' => $request->updated_at,
            'images' => $product->images->map(function ($image) {
                return [
                    'id' => $image->id,
                    'image_path' => $image->image_path,
                    'is_primary' => $image->is_primary,
                    'order' => $image->order,
                ];
            }),
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'origin' => $product->origin,
                'year' => $product->year,
                'wine_type' => $product->wineType->name ?? null,
                'price_demanded' => $product->price_demanded,
            ],
        ]);
    }

    public function searchByProduct(string $id)
    {
        // Ruta pública: no carguem tot el perfil del restaurant (té camps
        // sensibles com balance/credit_card/adreça), només el nom a mostrar.
        $requests = RequestRestaurant::where('product_id', $id)
            ->where('status', 'pending')
            ->with([
                'user:id,name',
                'user.restaurants:id,user_id,business_name',
            ])
            ->get();

        $response = $requests->map(function ($request) {
            return [
                'id' => $request->id,
                'user_id' => $request->user_id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
                'price_restaurant' => $request->price_restaurant,
                'status' => $request->status,
                'restaurant_name' => $request->user?->restaurants?->business_name
                    ?? $request->user?->name
                    ?? "Restaurant #{$request->user_id}",
                'created_at' => $request->created_at,
            ];
        });

        return response()->json($response);
    }

    public function searchActiveUserRequests()
    {
        $requestCounts = RequestRestaurant::select('user_id')
            ->selectRaw('count(*) as requests_count')
            ->where('status', 'pending')
            ->groupBy('user_id')
            ->having('requests_count', '>=', 1)
            ->get();

        return response()->json($requestCounts);
    }
}
