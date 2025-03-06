<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Seller;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.']
            ]);
        }

        if (Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.']
            ]);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    public function storeSeller(Request $request)
    {
        Log::info('Solicitud recibida para crear un inversor', ['data' => $request->all()]);

        try {
            // Validar los datos de entrada
            $validatedData = $request->validate([
                'NIF' => 'required|string|max:9|unique:users,NIF',
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email',
                'password' => 'required|string|min:8',
                'address' => 'nullable|string|max:255',
                'phone' => 'nullable|string|max:20',
                'name_contact' => 'nullable|string|max:20',
                'bank_account' => 'nullable|string|max:34',
                'balance' => 'nullable|numeric',
            ]);

            Log::info('Datos validados correctamente', ['validated_data' => $validatedData]);

            // Crear usuario
            $user = User::create([
                'NIF' => $validatedData['NIF'],
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'address' => $validatedData['address'],
                'phone_contact' => $validatedData['phone'],
                'role' => 'seller',
                'email_verified_at' => now(),
            ]);

            Log::info('Usuario creado correctamente', ['user_id' => $user->id]);

            // Crear inversor
            $seller = Seller::create([
                'user_id' => $user->id,
                'name_contact' => $validatedData['name_contact'],
                'bank_account' => $validatedData['bank_account'],
                'balance' => $validatedData['balance'] ?? 0.00,
            ]);

            Log::info('Inversor creado exitosamente', ['seller_id' => $seller->id]);

            return response()->json([
                'message' => 'Inversor creado exitosamente',
                'seller' => $seller,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error al crear inversor', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Error al crear inversor',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
