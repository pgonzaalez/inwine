<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Restaurant;
use App\Models\RequestRestaurant;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\UserRole;

class RestaurantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $restaurant = Restaurant::all();
        return response()->json($restaurant);
    }

    public function indexInfo()
    {
        $restaurants = Restaurant::all();

        $response = $restaurants->map(function ($restaurant) {
            return [
                "id" => $restaurant->id,
                "user_id" => $restaurant->user_id,
                'name' => $restaurant->business_name,
                'address' => $restaurant->address,
                'image' => $restaurant->image,
                'zone' => $restaurant->province,
                'description' => $restaurant->description,
                'number_of_diners' => $restaurant->number_of_diners,
                'wine_rotation' => $restaurant->wine_rotation,
                'reference_number' => $restaurant->reference_number,
                'shifts' => $restaurant->shifts,
            ];
        });

        return response()->json($response);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $restaurant = Restaurant::create($request->all());
        return response()->json($restaurant);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $restaurant = Restaurant::find($id);
        return response()->json($restaurant);
    }

    public function showPublicData(string $id)
    {
        $restaurant = Restaurant::find($id);
        $response = [
            "id" => $restaurant->id,
            "user_id" => $restaurant->user_id,
            'name' => $restaurant->business_name,
            'address' => $restaurant->address,
            'image' => $restaurant->image,
            'zone' => $restaurant->province,
            'description' => $restaurant->description,
            'created_at' => $restaurant->created_at,
            'number_of_diners' => $restaurant->number_of_diners,
            'wine_rotation' => $restaurant->wine_rotation,
            'reference_number' => $restaurant->reference_number,
            'shifts' => $restaurant->shifts,
        ];
        return response()->json($response);
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
            'business_name' => 'required|min:5',
            'province' => 'required|min:3',
            'description' => 'required|min:20|max:100',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
            'number_of_diners' => 'nullable|numeric',
            'wine_rotation' => 'required|string|max:20',
            'reference_number' => 'required|numeric',
            'shifts' => 'required|string|max:32',
        ]);

        if ($validator->fails()) {
            Log::warning('Validación fallida', ['errors' => $validator->errors()]);
            return response()->json(['errors' => $validator->errors()], 422);
        }

        Log::info('Datos validados correctamente');

        $restaurantData = [
            'address' => $request->address,
            'phone_contact' => $request->phone_contact,
            'name_contact' => $request->name_contact,
            'credit_card' => $request->credit_card,
            'business_name' => $request->business_name,
            'province' => $request->province,
            'description' => $request->description,
            'number_of_diners' => $request->number_of_diners,
            'wine_rotation' => $request->wine_rotation,
            'reference_number' => $request->reference_number,
            'shifts' => $request->shifts,
        ];

        try {
            DB::beginTransaction();

            Log::info('Verificando si el usuario ya tiene rol de restaurante');

            $restaurantRole = UserRole::where('user_id', $user->id)
                ->where('role', 'restaurant')
                ->first();

            if (!$restaurantRole) {
                Log::info('Usuario no tiene rol de restaurante. Asignando rol...');
                UserRole::create([
                    'user_id' => $user->id,
                    'role' => 'restaurant'
                ]);
            } else {
                Log::info('Usuario ya tiene rol de restaurante');
            }

            $currentRestaurant = Restaurant::where('user_id', $user->id)->first();
            $oldImagePath = null;

            if ($request->hasFile('image')) {
                if ($currentRestaurant && $currentRestaurant->image) {
                    $oldImagePath = ltrim(str_replace('/storage/', '', parse_url($currentRestaurant->image, PHP_URL_PATH)), '/');
                }
                $path = $request->file('image')->store('restaurants', 'public');
                $restaurantData['image'] = Storage::url($path);
            } elseif ($request->boolean('remove_image')) {
                if ($currentRestaurant && $currentRestaurant->image) {
                    $oldImagePath = ltrim(str_replace('/storage/', '', parse_url($currentRestaurant->image, PHP_URL_PATH)), '/');
                }
                $restaurantData['image'] = null;
            }

            Log::info('Creando o actualizando datos del vendedor', ['restaurantData' => $restaurantData]);

            Restaurant::updateOrCreate(
                ['user_id' => $user->id],
                $restaurantData
            );

            if ($oldImagePath && Storage::disk('public')->exists($oldImagePath)) {
                Storage::disk('public')->delete($oldImagePath);
            }

            DB::commit();

            Log::info('Información de vendedor guardada correctamente');

            return response()->json([
                'message' => 'Información de restaurante actualizada correctamente',
                'seller' => $restaurantData
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al guardar la información del restaurante', [
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
