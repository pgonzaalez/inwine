<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RequestRestaurant;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\UserRole;

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

    public function searchByProduct(string $id)
    {
        $restaurant = Restaurant::find($id);
        return response()->json($restaurant);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        Log::info('Solicitud recibida para crear un restaurante', ['data' => $request->all()]);

        $user = Auth::user();

        if (!$user) {
            Log::warning('Intento de actualización sin autenticación');
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }

        Log::info('Usuario autenticado', ['user_id' => $user->id]);

        $validator = Validator::make($request->all(), [
            'address' => 'required|string|min:5',
            'phone_contact' => 'required|min:9',
            'name_contact' => 'required|string|min:2',
            'credit_card' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            Log::warning('Validación fallida', ['errors' => $validator->errors()]);
            return response()->json(['errors' => $validator->errors()], 422);
        }

        Log::info('Datos validados correctamente');

        try {
            DB::beginTransaction();

            Log::info('Verificando si el usuario ya tiene rol de restaurante');

            $sellerRole = UserRole::where('user_id', $user->id)
                ->where('role', 'seller')
                ->first();

            if (!$sellerRole) {
                Log::info('Usuario no tiene rol de vendedor. Asignando rol...');
                UserRole::create([
                    'user_id' => $user->id,
                    'role' => 'seller'
                ]);
            } else {
                Log::info('Usuario ya tiene rol de vendedor');
            }

            $restaurantData = [
                'address' => $request->address,
                'phone_contact' => $request->phone_contact,
                'name_contact' => $request->name_contact,
                'bank_account' => $request->bank_account,
            ];

            Log::info('Creando o actualizando datos del vendedor', ['restaurantData' => $restaurantData]);

            Restaurant::updateOrCreate(
                ['user_id' => $user->id],
                $restaurantData
            );

            DB::commit();

            Log::info('Información de vendedor guardada correctamente');

            return response()->json([
                'message' => 'Información de vendedor actualizada correctamente',
                'seller' => $restaurantData
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al guardar la información del vendedor', [
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Error al actualizar la información de vendedor',
                'error' => $e->getMessage()
            ], 500);
        }
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
}
