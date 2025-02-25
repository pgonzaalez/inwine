<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WineType;

class WineTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $wineType = WineType::pluck('name');

        return response()->json($wineType);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $wineType = WineType::create($request->all());
        return response()->json($wineType, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $wineType = WineType::find($id);
        return response()->json($wineType);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $wineType = WineType::find($id);
        $wineType->update($request->all());
        return response()->json($wineType);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $wineType = WineType::find($id);
        $wineType->delete();
        return response()->json(null, 204);
    }
}
