<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use App\Models\Request;
use App\Models\RequestRestaurant;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Notifications\ProductStatusUpdated;
use App\Models\User;
use Illuminate\Http\Request as HttpRequest;

class LogisticController extends Controller
{
    /**
     * 1) Aprobar una solicitud
     *    - Pasa de:
     *        Product: in_stock  --> requested
     *        RequestRestaurant: pending    --> accepted
     *        Request:           null/???   --> paid
     *    - Esta peticion la hace el usuario con rol 'investor'
     */
    public function approve(HttpRequest $request, $productId)
    {
        DB::beginTransaction();

        try {
            // 1) Obtenemos el producto
            $product = Product::findOrFail($productId);

            if (trim(strtolower($product->status)) !== 'in_stock') {
                Log::info("Estado del producto ID: {$product->id} -> '{$product->status}'");
                return response()->json(['error' => "El producto no está in_stock. Estado actual: '{$product->status}'"], 422);
            }

            // 2) Obtenemos la solicitud de restaurante relacionada
            $restaurantRequest = RequestRestaurant::where('product_id', $productId)
                ->where('status', 'pending')
                ->orderBy('created_at', 'desc')
                ->first();

            if (!$restaurantRequest) {
                return response()->json(['error' => 'No se encontró una solicitud de restaurante pendiente para este producto.'], 404);
            }

            // 3) Crear una nueva solicitud del inversor con estado 'paid'
            $investorRequest = Request::create([
                'user_id' => 3,
                'request_restaurant_id' => 1,
                'status' => 'paid'
            ]);

            // Actualizamos estados
            $product->update(['status' => 'requested']);
            $restaurantRequest->update(['status' => 'accepted']);

            DB::commit();

            // Notificar al vendedor
            $sellerUser = User::find($product->user_id);
            $sellerUser->notify(new ProductStatusUpdated($product, 'requested'),);
            // Notificar al restaurante
            $restaurantUser = User::find($restaurantRequest->user_id);
            $restaurantUser->notify(new ProductStatusUpdated($product, 'requested'));
            // Notificar al inversor
            $investorUser = User::find($investorRequest->user_id);
            $investorUser->notify(new ProductStatusUpdated($product, 'requested'));


            return response()->json([
                'message' => 'Solicitud aprobada correctamente.',
                'product_status' => $product->status,
                'restaurant_request_status' => $restaurantRequest->status,
                'investor_request_status' => $investorRequest->status,
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Error al aprobar la solicitud: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * 2) Enviar el producto (En tránsito)
     *    - Pasa de:
     *        Product: requested   --> in_transit
     *        RequestRestaurant: accepted   --> in_transit
     *        Request: paid       --> shipped
     *   - Esta peticion la hace el usuario con rol 'seller'
     */
    public function send(HttpRequest $request, $productId)
    {
        DB::beginTransaction();

        try {
            // 1) Obtenemos el producto
            $product = Product::findOrFail($productId);

            // Verificar que el usuario es el propietario (si es necesario)
            if (Auth::check() && $product->user_id !== Auth::id()) {
                return response()->json(['error' => 'No tienes permiso para enviar este producto.'], 403);
            }

            if ($product->status !== 'requested') {
                return response()->json(['error' => 'El producto no está en estado requested.'], 422);
            }

            if ($product->status !== 'requested') {
                return response()->json(['error' => 'El producto no está en estado requested.'], 422);
            }

            // 2) Obtenemos la solicitud de restaurante
            $restaurantRequest = RequestRestaurant::where('product_id', $productId)
                ->where('status', 'accepted')
                ->orderBy('created_at', 'desc')
                ->first();

            if (!$restaurantRequest) {
                return response()->json(['error' => 'No se encontró una solicitud de restaurante en estado accepted.'], 404);
            }

            // 3) Obtenemos la solicitud del inversor
            $investorRequest = Request::where('request_restaurant_id', $restaurantRequest->id)
                ->where('status', 'paid')
                ->orderBy('created_at', 'desc')
                ->first();

            if (!$investorRequest) {
                return response()->json(['error' => 'No se encontró una solicitud de inversor en estado paid.'], 404);
            }

            // Actualizamos estados
            $product->update(['status' => 'in_transit']);
            $restaurantRequest->update(['status' => 'in_transit']);
            $investorRequest->update(['status' => 'shipped']);

            DB::commit();

            // Notificar al vendedor
            $sellerUser = User::find($product->user_id);
            $sellerUser->notify(new ProductStatusUpdated($product, 'requested'),);
            // Notificar al restaurante
            $restaurantUser = User::find($restaurantRequest->user_id);
            $restaurantUser->notify(new ProductStatusUpdated($product, 'requested'));
            // Notificar al inversor
            $investorUser = User::find($investorRequest->user_id);
            $investorUser->notify(new ProductStatusUpdated($product, 'requested'));


            return response()->json([
                'message' => 'Producto enviado y en tránsito.',
                'product_status' => $product->status,
                'restaurant_request_status' => $restaurantRequest->status,
                'investor_request_status' => $investorRequest->status,
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Error al enviar el producto: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * 3) Marcar como entregado en el local (El producto llega al restaurante)
     *    - Pasa de:
     *        Product: in_transit   --> sold
     *        RequestRestaurant: in_transit  --> in_my_local
     *        Request: shipped      --> completed
     *   - Esta peticion la hace el usuario con rol 'restaurant'
     */
    public function deliver(HttpRequest $request, $productId)
    {
        DB::beginTransaction();

        try {
            $product = Product::findOrFail($productId);

            if ($product->status !== 'in_transit') {
                return response()->json(['error' => 'El producto no está en estado in_transit.'], 422);
            }

            $restaurantRequest = RequestRestaurant::where('product_id', $productId)
                ->where('status', 'in_transit')
                ->orderBy('created_at', 'desc')
                ->first();

            if (!$restaurantRequest) {
                return response()->json(['error' => 'No se encontró una solicitud de restaurante en estado in_transit.'], 404);
            }

            $investorRequest = Request::where('request_restaurant_id', $restaurantRequest->id)
                ->where('status', 'shipped')
                ->orderBy('created_at', 'desc')
                ->first();

            if (!$investorRequest) {
                return response()->json(['error' => 'No se encontró una solicitud de inversor en estado shipped.'], 404);
            }

            // Actualizamos estados
            $product->update(['status' => 'sold']);
            $restaurantRequest->update(['status' => 'in_my_local']);
            $investorRequest->update(['status' => 'waiting']);

            DB::commit();

            $sellerUser = User::find($product->user_id);
            $sellerUser->notify(new ProductStatusUpdated($product, 'sold'),);
            // Notificar al restaurante
            $restaurantUser = User::find($restaurantRequest->user_id);
            $restaurantUser->notify(new ProductStatusUpdated($restaurantRequest, 'en mi local'));
            // Notificar al inversor
            $investorUser = User::find($investorRequest->user_id);
            $investorUser->notify(new ProductStatusUpdated($product, 'sold'));

            return response()->json([
                'message' => 'Producto entregado al restaurante.',
                'product_status' => $product->status,
                'restaurant_request_status' => $restaurantRequest->status,
                'investor_request_status' => $investorRequest->status,
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Error al entregar el producto: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * 4) Marcar el producto como vendido (cliente final compra el vino en el restaurante)
     *    - Pasa de:
     *        RequestRestaurant: in_my_local --> sold
     *        Request: waiting     --> completed (sin cambio)
     *   - Esta peticion la hace el usuario con rol 'investor'
     */
    public function sell(HttpRequest $request, $productId)
    {
        DB::beginTransaction();

        try {
            Product::findOrFail($productId);
            $restaurantRequest = RequestRestaurant::where('product_id', $productId)
                ->where('status', 'in_my_local')
                ->orderBy('created_at', 'desc')
                ->first();

            if (!$restaurantRequest) {
                return response()->json(['error' => 'No se encontró una solicitud de restaurante en estado in_my_local.'], 404);
            }

            $investorRequest = Request::where('request_restaurant_id', $restaurantRequest->id)
                ->orderBy('created_at', 'desc')
                ->first();

            // Actualizamos estados
            $restaurantRequest->update(['status' => 'sold']);

            // En la tabla requests, "completed" no cambia, pero si deseas
            // dejarlo explícito, lo puedes volver a asignar:
            if ($investorRequest && $investorRequest->status === 'waiting') {
                $investorRequest->update(['status' => 'completed']);
            }

            DB::commit();

            return response()->json([
                'message' => 'Producto marcado como vendido.',
                'restaurant_request_status' => $restaurantRequest->status,
                'investor_request_status' => $investorRequest->status ?? null,
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Error al marcar como vendido: ' . $e->getMessage()
            ], 500);
        }
    }
}
