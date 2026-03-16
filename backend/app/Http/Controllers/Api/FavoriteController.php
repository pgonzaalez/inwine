<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    /**
     * Get the user's favorite products.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $favorites = $user->favorites()
            ->with(['wineType', 'seller'])
            ->withCount('requestsRestaurant')
            ->get();

        $response = $favorites->map(function ($product) {
            return [
                "id" => $product->id,
                'name' => $product->name,
                'origin' => $product->origin,
                'year' => $product->year,
                'wine_type' => $product->wineType ? $product->wineType->name : null,
                'price_demanded' => $product->price_demanded,
                'quantity' => $product->quantity,
                'image' => $product->image,
                'status' => $product->status,
                'user_id' => $product->seller ? $product->seller->name : $product->user_id,
                'created_at' => $product->created_at,
                'updated_at' => $product->updated_at,
                'requests_restaurant_count' => $product->requests_restaurant_count,
            ];
        });

        return response()->json($response);
    }

    /**
     * Toggle a product as favorite for the authenticated user.
     */
    public function toggle(Request $request, $productId)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $product = Product::find($productId);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $status = $user->favorites()->toggle($productId);
        
        $isFavorite = count($status['attached']) > 0;

        return response()->json([
            'message' => $isFavorite ? 'Product added to favorites' : 'Product removed from favorites',
            'is_favorite' => $isFavorite
        ]);
    }

    /**
     * Get only the IDs of the user's favorite products.
     * Useful for frontend initial state.
     */
    public function ids(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $favoriteIds = $user->favorites()->pluck('product_id');

        return response()->json($favoriteIds);
    }
}
