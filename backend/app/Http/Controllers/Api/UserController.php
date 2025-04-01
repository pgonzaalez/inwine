<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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
        $user = $request->user()->load('roles');

        $responseData = [
            'id' => $user->id,
            'NIF' => $user->NIF,
            'name' => $user->name,
            'email' => $user->email,

            // Agrega otros campos básicos del usuario que necesites
            'roles' => $user->roles->pluck('role'),

            //Devuelve la informacion de los campos especificos de cada rol
            'details' => []
        ];

        // Cargar relaciones según los roles que tenga el usuario
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
        Log::info('Solicitud recibida para editar un usuario', ['data' => $request->all()]);

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

        Log::info('Datos validados correctamente', ['validated_data' => $validatedData]);

        $user->update($validatedData);

        Log::info('Usuario editado correctamente', ['user_id' => $user->id]);

        return response()->json($user);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
