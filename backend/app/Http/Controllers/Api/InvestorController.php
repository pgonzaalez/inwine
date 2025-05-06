<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Investor;
use App\Models\OrderRequested;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\UserRole;
use App\Models\User;

class InvestorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) {}

    /**
     * Display the specified resource.
     */
    public function show(string $id) {}

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        Log::info('Solicitud recibida para crear un inversor', ['data' => $request->all()]);

        $user = Auth::user();

        if (!$user) {
            Log::warning('Intento de actualización sin autenticación');
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }

        Log::info('Usuario autenticado', ['user_id' => $user->id]);

        $validator = Validator::make($request->all(), [
            'address' => 'required|string|min:5',
            'phone_contact' => 'required|min:9',
            'credit_card' => 'nullable|string',
            'bank_account' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            Log::warning('Validación fallida', ['errors' => $validator->errors()]);
            return response()->json(['errors' => $validator->errors()], 422);
        }

        Log::info('Datos validados correctamente');

        try {
            DB::beginTransaction();

            Log::info('Verificando si el usuario ya tiene rol de inversor');

            $investorRole = UserRole::where('user_id', $user->id)
                ->where('role', 'investor')
                ->first();

            if (!$investorRole) {
                Log::info('Usuario no tiene rol de inversor. Asignando rol...');
                UserRole::create([
                    'user_id' => $user->id,
                    'role' => 'investor'
                ]);
            } else {
                Log::info('Usuario ya tiene rol de inversor');
            }

            $inversorData = [
                'address' => $request->address,
                'phone_contact' => $request->phone_contact,
                'credit_card' => $request->credit_card,
                'bank_account' => $request->bank_account,
            ];

            Log::info('Creando o actualizando datos del inversor', ['inversorData' => $inversorData]);

            Investor::updateOrCreate(
                ['user_id' => $user->id],
                $inversorData
            );

            DB::commit();

            Log::info('Información de inversor guardada correctamente');

            return response()->json([
                'message' => 'Información de inversor actualizada correctamente',
                'seller' => $inversorData
            ], 200);
        } catch (\Exception $e) {
            // DB::rollBack();
            Log::error('Error al guardar la información del inversor', [
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Error al actualizar la información de inversor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id) {}

    public function investments(Request $request, $userId)
    {
        $authenticatedUser = $request->user();

        if ($authenticatedUser->id != $userId) {
            return response()->json(['message' => 'No tienes permiso para ver estas inversiones'], 403);
        }

        $investor = User::find($userId);

        if (!$investor) {
            return response()->json(['message' => 'Inversor no encontrado'], 404);
        }

        $investments = OrderRequested::where('user_id', $userId)
            ->with([
                'requestRestaurant.product.seller',
                'requestRestaurant.user',
            ])
            ->get();

        if ($investments->isEmpty()) {
            return response()->json(['message' => 'No se encontraron inversiones para este inversor'], 404);
        }

        $data = $investments->map(function ($investment) {
            $requestRestaurant = $investment->requestRestaurant;
            $product = $requestRestaurant->product;
            $seller = $product->seller;
            $restaurantUser = $requestRestaurant->user;

            return [
                'investment_id' => $investment->id,
                'status' => $investment->status,
                'user_id' => $investment->user_id,
                'request_restaurant_id' => $investment->request_restaurant_id,
                'price_restaurant' => $requestRestaurant->price_restaurant,
                'quantity' => $requestRestaurant->quantity,
                'product' => [
                    'name' => $product->name,
                    'origin' => $product->origin,
                    'year' => $product->year,
                    'image' => $product->image,
                    'price_demanded' => $product->price_demanded,
                ],
                'seller_name' => $seller->name ?? null,
                'restaurant_name' => $restaurantUser->name ?? null,
                'created_at' => $investment->created_at,
            ];
        });

        return response()->json(['message' => 'Inversiones obtenidas correctamente', 'investments' => $data], 200);
    }


    public function showInvestment(Request $request, $userId, $investmentId)
    {
        $authenticatedUser = $request->user();

        if ($authenticatedUser->id != $userId) {
            return response()->json(['message' => 'No tienes permiso para ver esta inversión'], 403);
        }

        $investment = OrderRequested::where('user_id', $userId)
            ->where('id', $investmentId)
            ->with([
                'requestRestaurant.product.seller',
                'requestRestaurant.user',
            ])
            ->first();

        if (!$investment) {
            return response()->json(['message' => 'Inversión no encontrada'], 404);
        }

        $requestRestaurant = $investment->requestRestaurant;
        $product = $requestRestaurant->product;
        $seller = $product->seller;
        $restaurantUser = $requestRestaurant->user;

        $data = [
            'investment_id' => $investment->id,
            'status' => $investment->status,
            'user_id' => $investment->user_id,
            'request_restaurant_id' => $investment->request_restaurant_id,
            'price_restaurant' => $requestRestaurant->price_restaurant,
            'quantity' => $requestRestaurant->quantity,
            'product' => [
                'name' => $product->name,
                'origin' => $product->origin,
                'year' => $product->year,
                'image' => $product->image,
                'price_demanded' => $product->price_demanded,
            ],
            'seller_name' => $seller->name ?? null,
            'restaurant_name' => $restaurantUser->name ?? null,
            'created_at' => $investment->created_at,
        ];

        return response()->json(['message' => 'Inversión obtenida correctamente', 'investment' => $data], 200);
    }
}
