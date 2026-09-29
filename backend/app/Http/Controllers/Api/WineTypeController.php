<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WineType;
use Illuminate\Support\Facades\Log;

class WineTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(WineType::get(['id','name', 'image']));
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|string|max:2048',
        ]);
        $wineType = WineType::create($validated);

        Log::info('Tipo de vino creado', ['wine_type_id' => $wineType->id, 'user_id' => auth()->id()]);

        return response()->json($wineType, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $wineType = WineType::find($id);
        if (!$wineType) {
            return response()->json(['message' => 'Wine type not found'], 404);
        }
        return response()->json($wineType);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $wineType = WineType::find($id);
        if (!$wineType) {
            return response()->json(['message' => 'Wine type not found'], 404);
        }
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'image' => 'nullable|string|max:2048',
        ]);
        $wineType->update($validated);

        Log::info('Tipo de vino actualizado', ['wine_type_id' => $wineType->id, 'user_id' => auth()->id()]);

        return response()->json($wineType);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $wineType = WineType::find($id);
        if (!$wineType) {
            return response()->json(['message' => 'Wine type not found'], 404);
        }
        $wineTypeId = $wineType->id;
        $wineType->delete();

        Log::info('Tipo de vino eliminado', ['wine_type_id' => $wineTypeId, 'user_id' => auth()->id()]);

        return response()->json(null, 204);
    }
}
