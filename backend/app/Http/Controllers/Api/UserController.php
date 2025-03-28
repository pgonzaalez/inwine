<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
