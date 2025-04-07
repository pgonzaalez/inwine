<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use App\Models\Investor;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Seller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\UserRole;

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
                'email' => ['Usuari o contrasenya incorrecta.']
            ]);
        }
    
        if (!Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Usuari o contrasenya incorrecta.']
            ]);
        }
    
        // Obtener todos los roles del usuario
        $roles = UserRole::where('user_id', $user->id)->pluck('role')->toArray();
    
        $token = $user->createToken('api-token')->plainTextToken;
    
        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $roles, // Ahora devolvemos un array de roles
            ],
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
        Log::info('Solicitud recibida para crear un productor', ['data' => $request->all()]);

        try {
            // Validar los datos de entrada
            $validatedData = Validator::make($request->all(), [
                'NIF' => 'required|string|max:9|unique:users,NIF',
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email',
                'password' => 'required|string|min:8',
                'address' => 'nullable|string|min:2|max:255',
                'phone' => 'nullable|string|max:11',
                'name_contact' => 'nullable|string|max:20',
                'bank_account' => 'nullable|string|max:34',
                'balance' => 'nullable|numeric',
            ]);

            if ($validatedData->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validatedData->errors()
                ], 422);
            }

            DB::beginTransaction();

            // Obtener los datos validados
            $validatedData = $validatedData->validated();

            Log::info('Datos validados correctamente', ['validated_data' => $validatedData]);

            // Crear usuario
            $user = User::create([
                'NIF' => $validatedData['NIF'],
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'email_verified_at' => now(),
            ]);

            Log::info('Usuario creado correctamente', ['user_id' => $user->id]);

            // Asignar rol de seller
            UserRole::create([
                'user_id' => $user->id,
                'role' => 'seller'
            ]);

            // Crear seller con todos los campos requeridos
            $seller = Seller::create([
                'user_id' => $user->id,
                'address' => $validatedData['address'],
                'phone_contact' => $validatedData['phone'],
                'name_contact' => $validatedData['name_contact'],
                'bank_account' => $validatedData['bank_account'] ?? null,
                'balance' => $validatedData['balance'] ?? 0.00,
            ]);

            Log::info('Productor creado exitosamente', ['seller_id' => $seller->id]);

            DB::commit();

            return response()->json([
                'message' => 'Productor creado exitosamente',
                'seller' => $seller,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al crear productor', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Error al crear productor',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function storeRestaurant(Request $request)
    {
        Log::info('Solicitud recibida para crear un restaurante', ['data' => $request->all()]);

        try {
            // Validar los datos de entrada
            $validatedData = Validator::make($request->all(), [
                'NIF' => 'required|string|max:9|unique:users,NIF',
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email',
                'password' => 'required|string|min:8',
                'address' => 'nullable|string|min:2|max:255',
                'phone' => 'nullable|string|max:11',
                'name_contact' => 'nullable|string|max:20',
                'credit_card' => 'nullable|string|max:34',
                'balance' => 'nullable|numeric',
            ]);

            if ($validatedData->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validatedData->errors()
                ], 422);
            }

            DB::beginTransaction();

            // Obtener los datos validados
            $validatedData = $validatedData->validated();

            Log::info('Datos validados correctamente', ['validated_data' => $validatedData]);

            // Crear usuario
            $user = User::create([
                'NIF' => $validatedData['NIF'],
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'email_verified_at' => now(),
            ]);

            Log::info('Usuario creado correctamente', ['user_id' => $user->id]);

            // Asignar rol de restaurant
            UserRole::create([
                'user_id' => $user->id,
                'role' => 'restaurant'
            ]);

            // Crear restaurante con todos los campos requeridos
            $restaurant = Restaurant::create([
                'user_id' => $user->id,
                'address' => $validatedData['address'],
                'phone_contact' => $validatedData['phone'],
                'name_contact' => $validatedData['name_contact'],
                'credit_card' => $validatedData['credit_card'] ?? null,
                'balance' => $validatedData['balance'] ?? 0.00,
            ]);

            Log::info('Restaurante creado exitosamente', ['restaurant' => $restaurant->id]);

            DB::commit();

            return response()->json([
                'message' => 'Restaurante creado exitosamente',
                'restaurant' => $restaurant,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al crear restaurante', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Error al crear restaurante',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function storeInvestor(Request $request)
    {
        Log::info('Solicitud recibida para crear un inversor', ['data' => $request->all()]);

        try {
            // Validar los datos de entrada
            $validatedData = Validator::make($request->all(), [
                'NIF' => 'required|string|max:9|unique:users,NIF',
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email',
                'password' => 'required|string|min:8',
                'address' => 'nullable|string|min:2|max:255',
                'phone' => 'nullable|string|max:11',
                'credit_card' => 'nullable|string|max:34',
                'bank_account' => 'nullable|string|max:34',
                'balance' => 'nullable|numeric',
            ]);

            if ($validatedData->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validatedData->errors()
                ], 422);
            }

            DB::beginTransaction();

            // Obtener los datos validados
            $validatedData = $validatedData->validated();

            Log::info('Datos validados correctamente', ['validated_data' => $validatedData]);

            // Crear usuario
            $user = User::create([
                'NIF' => $validatedData['NIF'],
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'email_verified_at' => now(),
            ]);

            Log::info('Usuario creado correctamente', ['user_id' => $user->id]);

            // Asignar rol de inversor
            UserRole::create([
                'user_id' => $user->id,
                'role' => 'investor'
            ]);

            // Crear inversor con todos los campos requeridos
            $investor = Investor::create([
                'user_id' => $user->id,
                'address' => $validatedData['address'],
                'phone_contact' => $validatedData['phone'],
                'credit_card' => $validatedData['credit_card'] ?? null,
                'bank_account' => $validatedData['bank_account'] ?? null,
                'balance' => $validatedData['balance'] ?? 0.00,
            ]);

            Log::info('Inversor creado exitosamente', ['investor' => $investor->id]);

            DB::commit();

            return response()->json([
                'message' => 'Inversor creado exitosamente',
                'investor' => $investor,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al crear inversor', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Error al crear inversor',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
