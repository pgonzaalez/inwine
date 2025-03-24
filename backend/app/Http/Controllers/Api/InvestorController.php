<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Investor;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class InvestorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Obtener todos los inversores
        $investors = Investor::all();
        return response()->json($investors, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
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

            DB::beginTransaction();

            // Crear usuario
            $user = User::create([
                'NIF' => $validatedData['NIF'],
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'address' => $validatedData['address'],
                'phone_contact' => $validatedData['phone'],
                'role' => 'investor',
                'email_verified_at' => now(),
            ]);

            Log::info('Usuario creado correctamente', ['user_id' => $user->id]);

            // Crear inversor
            $investor = Investor::create([
                'user_id' => $user->id,
                'name_contact' => $validatedData['name_contact'],
                'bank_account' => $validatedData['bank_account'],
                'balance' => $validatedData['balance'] ?? 0.00,
            ]);

            Log::info('Inversor creado exitosamente', ['investor_id' => $investor->id]);

            DB::commit();

            return response()->json([
                'message' => 'Inversor creado exitosamente',
                'investor' => $investor,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error al crear inversor', ['error' => $e->getMessage()]);

            DB::rollBack();
            
            return response()->json([
                'message' => 'Error al crear inversor',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Buscar el inversor por ID
        $investor = Investor::find($id);

        // Si no se encuentra, devolver un error 404
        if (!$investor) {
            return response()->json(['message' => 'Inversor no encontrado'], 404);
        }

        // Devolver el inversor encontrado
        return response()->json($investor, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Buscar el inversor por ID
        $investor = Investor::find($id);

        // Si no se encuentra, devolver un error 404
        if (!$investor) {
            return response()->json(['message' => 'Inversor no encontrado'], 404);
        }

        // Validar los datos de entrada
        $request->validate([
            'NIF' => [
                'sometimes',
                'string',
                'max:9',
                Rule::unique('investors')->ignore($investor->id), // Ignorar el NIF actual del inversor
            ],
            'name' => 'sometimes|string|max:255',
            'email' => [
                'sometimes',
                'string',
                'email',
                'max:255',
                Rule::unique('investors')->ignore($investor->id), // Ignorar el email actual del inversor
            ],
            'password' => 'sometimes|string|min:8',
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'credit_card' => 'nullable|string|max:20',
            'bank_account' => 'nullable|string|max:34',
            'balance' => 'nullable|numeric',
        ]);

        // Actualizar los datos del inversor
        $investor->update([
            'NIF' => $request->NIF ?? $investor->NIF,
            'name' => $request->name ?? $investor->name,
            'email' => $request->email ?? $investor->email,
            'password' => $request->password ? Hash::make($request->password) : $investor->password, // Encriptar la nueva contraseña si se proporciona
            'address' => $request->address ?? $investor->address,
            'phone' => $request->phone ?? $investor->phone,
            'credit_card' => $request->credit_card ?? $investor->credit_card,
            'bank_account' => $request->bank_account ?? $investor->bank_account,
            'balance' => $request->balance ?? $investor->balance,
        ]);

        // Respuesta JSON
        return response()->json([
            'message' => 'Inversor actualizado exitosamente',
            'investor' => $investor,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Buscar el inversor por ID
        $investor = Investor::find($id);

        // Si no se encuentra, devolver un error 404
        if (!$investor) {
            return response()->json(['message' => 'Inversor no encontrado'], 404);
        }

        // Eliminar el inversor
        $investor->delete();

        // Respuesta JSON
        return response()->json(['message' => 'Inversor eliminado exitosamente'], 200);
    }
}
