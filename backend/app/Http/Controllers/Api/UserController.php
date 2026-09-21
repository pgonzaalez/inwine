<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
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
public function show(Request $request)
{
    if (!$request->user()) {
        return response()->json(['message' => 'Unauthenticated'], 401);
    }

    $user = $request->user()->load('roles');
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $user->load('roles');

        $activeRoles = $user->roles
            ->where('is_active', 1)
            ->pluck('role');

        $responseData = [
            'id' => $user->id,
            'NIF' => $user->NIF,
            'name' => $user->name,
            'email' => $user->email,
            'notify_by_email' => $user->notify_by_email,
            'roles' => $user->roles->pluck('role'),
            'active_role' => $activeRoles,
            'details' => []
        ];

        foreach ($user->roles as $role) {
            switch ($role->role) {
                case 'restaurant':
                    $responseData['details']['restaurant'] = $user->restaurants;
                    break;
                case 'seller':
                    $responseData['details']['seller'] = $user->sellers;
                    break;
                case 'investor':
                    $responseData['details']['investor'] = $user->investors;
                    break;
            }
        }

        return response()->json($responseData);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        Log::info('Solicitud recibida para editar un usuario', ['data' => $request->except(['NIF'])]);

        $user = $request->user();

        $validatedData = Validator::make($request->all(), [
            'NIF' => 'required|string|max:9|unique:users,NIF,' . $user->id,
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
        ]);

        if ($validatedData->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validatedData->errors()
            ], 422);
        }

        $validatedData = $validatedData->validated();

        Log::info('Datos validados correctamente', ['validated_data' => collect($validatedData)->except('NIF')->all()]);

        $user->update($validatedData);

        Log::info('Usuario editado correctamente', ['user_id' => $user->id]);

        return response()->json($user);
    }

    /**
     * Actualiza las preferencias de notificación del usuario autenticado.
     * Endpoint separado de update() porque ese exige NIF/name/email, que
     * este formulario no tiene por qué enviar.
     */
    public function updatePreferences(Request $request)
    {
        $user = $request->user();

        $validated = Validator::make($request->all(), [
            'notify_by_email' => 'required|boolean',
        ]);

        if ($validated->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validated->errors(),
            ], 422);
        }

        $user->update($validated->validated());

        return response()->json(['success' => true, 'notify_by_email' => $user->notify_by_email]);
    }

    /**
     * Cambia la contraseña del usuario autenticado. Exige la contraseña
     * actual (no basta con tener sesión iniciada) para evitar que alguien
     * que encuentre una sesión abierta pueda apropiarse de la cuenta
     * cambiando la contraseña sin conocerla.
     */
    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $validated = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validated->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validated->errors(),
            ], 422);
        }

        $validated = $validated->validated();

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'success' => false,
                'errors' => ['current_password' => ['La contrasenya actual no és correcta.']],
            ], 422);
        }

        $user->update(['password' => Hash::make($validated['password'])]);

        Log::info('Contraseña actualizada', ['user_id' => $user->id]);

        return response()->json(['success' => true]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
