<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use App\Models\Seller;
use App\Models\UserRole;

class SellerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        Log::info('Solicitud recibida para crear un productor', ['data' => $request->all()]);

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
            'bank_account' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            Log::warning('Validación fallida', ['errors' => $validator->errors()]);
            return response()->json(['errors' => $validator->errors()], 422);
        }

        Log::info('Datos validados correctamente');

        try {
            DB::beginTransaction();

            Log::info('Verificando si el usuario ya tiene rol de vendedor');

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

            $sellerData = [
                'address' => $request->address,
                'phone_contact' => $request->phone_contact,
                'name_contact' => $request->name_contact,
                'bank_account' => $request->bank_account,
            ];

            Log::info('Creando o actualizando datos del vendedor', ['sellerData' => $sellerData]);

            Seller::updateOrCreate(
                ['user_id' => $user->id],
                $sellerData
            );

            DB::commit();

            Log::info('Información de vendedor guardada correctamente');

            return response()->json([
                'message' => 'Información de vendedor actualizada correctamente',
                'seller' => $sellerData
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
        //
    }
}
