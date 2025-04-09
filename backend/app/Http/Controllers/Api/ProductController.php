<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::where('status', 'in_stock')->get();
        
        $response = $products->map(function ($product) {
            return [
                "id"=> $product->id,
                'name' => $product->name,
                'origin' => $product->origin,
                'year' => $product->year,
                'wine_type' => $product->wineType->name,
                'price_demanded' => $product->price_demanded,
                'quantity' => $product->quantity,
                'image' => $product->image,
                'status' => $product->status,
                'user_id' => $product->seller->name,
                'created_at' => $product->created_at,
                'updated_at' => $product->updated_at
            ];
        });

        return response()->json($response);
    }

    /**
     * Display all products by user.
     */
    public function indexByUser(string $userId)
    {
        $products = Product::where('user_id', $userId)->get();

        $response = $products->map(function ($product) {
            return [
                'id'=> $product->id,
                'name' => $product->name,
                'origin' => $product->origin,
                'year' => $product->year,
                'wine_type' => $product->wineType->name,
                'price_demanded' => $product->price_demanded,
                'quantity' => $product->quantity,
                'image' => $product->image,
                'status' => $product->status,
                'user_id' => $product->user_id,
                'created_at' => $product->created_at,
                'updated_at' => $product->updated_at
            ];
        });

        return response()->json($response);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'origin' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'wine_type_id' => 'required|exists:wine_types,id',
            'description' => 'nullable|string',
            'price_demanded' => 'required|decimal:0,2|min:0',
            'quantity' => 'required|integer|min:0',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:10240',
            'user_id' => 'required|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();

        try {
            // Primero creamos el producto
            $productData = $request->only([
                'name',
                'origin',
                'year',
                'wine_type_id',
                'description',
                'price_demanded',
                'quantity',
                'user_id'
            ]);

            $product = Product::create($productData);

            // Después procesamos las imágenes
            if ($request->hasFile('images')) {

                Log::info('Se encontraron imágenes para almacenar');

                $isPrimary = true; // La primera imagen será la principal

                foreach ($request->file('images') as $index => $imageFile) {

                    $path = $imageFile->store('products', 'public');
                    Log::info('Procesando imagen', ['index' => $index]);
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => $path,
                        'is_primary' => $isPrimary,
                        'order' => $index
                    ]);

                    // Si es la primera imagen, también la guardamos en el campo image del producto
                    // para mantener compatibilidad con código existente
                    if ($isPrimary) {
                        $product->image = Storage::url($path);
                        $product->save();
                    }

                    Log::info('Imagen almacenada correctamente', ['path' => $path]);


                    $isPrimary = false; // Solo la primera imagen es principal
                }
            }

            Log::info('Producto creado exitosamente', ['product_id' => $product->id]);

            DB::commit();

            // Cargamos las imágenes para la respuesta
            $product->load('images');

            // Respuesta exitosa
            return response()->json([
                'success' => true,
                'data' => $product
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error al crear el producto', ['error' => $e->getMessage()]);

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al crear el producto: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::with('images')->find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Producto no encontrado'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $product
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Producto no encontrado'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'origin' => 'sometimes|required|string|max:255',
            'year' => 'sometimes|required|integer|min:1900|max:' . (date('Y') + 1),
            'wine_type_id' => 'sometimes|required|exists:wine_types,id',
            'description' => 'nullable|string',
            'price_demanded' => 'sometimes|required|decimal:0,2|min:0',
            'quantity' => 'sometimes|required|integer|min:0',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:10240',
            'user_id' => 'sometimes|required|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();

        try {
            // Actualizamos los datos del producto
            $productData = $request->only([
                'name',
                'origin',
                'year',
                'wine_type_id',
                'description',
                'price_demanded',
                'quantity',
                'user_id'
            ]);

            $product->update($productData);

            // Procesamos nuevas imágenes si se proporcionan
            if ($request->hasFile('images')) {
                // Determinamos si ya hay imágenes
                $hasPrimaryImage = $product->images()->where('is_primary', true)->exists();
                $isPrimary = !$hasPrimaryImage;
                $lastOrder = $product->images()->max('order') ?? -1;

                foreach ($request->file('images') as $imageFile) {
                    $path = $imageFile->store('products', 'public');
                    $lastOrder++;

                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => $path,
                        'is_primary' => $isPrimary,
                        'order' => $lastOrder
                    ]);

                    // Si es la primera imagen y no había una principal, actualizamos el campo image
                    if ($isPrimary) {
                        $product->image = Storage::url($path);
                        $product->save();
                        $isPrimary = false;
                    }
                }
            }

            DB::commit();

            // Cargamos las imágenes para la respuesta
            $product->load('images');

            return response()->json([
                'success' => true,
                'data' => $product
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el producto: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::with('images')->find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Producto no encontrado'
            ], 404);
        }

        DB::beginTransaction();

        try {
            // Eliminamos las imágenes del almacenamiento
            foreach ($product->images as $image) {
                // Extraemos la ruta relativa del storage
                $path = str_replace('/storage/', '', $image->image_path);
                if (Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }
                $image->delete();
            }

            // Eliminamos el producto
            $product->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Producto eliminado correctamente'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el producto: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar una imagen específica de un producto
     */
    public function deleteImage(string $productId, string $imageId)
    {
        $product = Product::find($productId);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Producto no encontrado'
            ], 404);
        }

        $image = ProductImage::where('product_id', $productId)
            ->where('id', $imageId)
            ->first();

        if (!$image) {
            return response()->json([
                'success' => false,
                'message' => 'Imagen no encontrada'
            ], 404);
        }

        DB::beginTransaction();

        try {
            // Verificamos si es la imagen principal
            $isPrimary = $image->is_primary;

            // Eliminamos la imagen del almacenamiento
            $path = str_replace('/storage/', '', $image->image_path);
            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }

            // Eliminamos el registro
            $image->delete();

            // Si era la imagen principal, asignamos otra como principal
            if ($isPrimary) {
                $newPrimaryImage = $product->images()->first();
                if ($newPrimaryImage) {
                    $newPrimaryImage->is_primary = true;
                    $newPrimaryImage->save();

                    // Actualizamos el campo image del producto
                    $product->image = Storage::url($newPrimaryImage->image_path);
                    $product->save();
                } else {
                    // No hay más imágenes, limpiamos el campo image
                    $product->image = null;
                    $product->save();
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Imagen eliminada correctamente'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la imagen: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Establecer una imagen como principal
     */
    public function setPrimaryImage(string $productId, string $imageId)
    {
        $product = Product::find($productId);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Producto no encontrado'
            ], 404);
        }

        $image = ProductImage::where('product_id', $productId)
            ->where('id', $imageId)
            ->first();

        if (!$image) {
            return response()->json([
                'success' => false,
                'message' => 'Imagen no encontrada'
            ], 404);
        }

        DB::beginTransaction();

        try {
            // Quitamos el estado de principal de todas las imágenes
            ProductImage::where('product_id', $productId)
                ->update(['is_primary' => false]);

            // Establecemos la nueva imagen principal
            $image->is_primary = true;
            $image->save();

            // Actualizamos el campo image del producto
            $product->image = Storage::url($image->image_path);
            $product->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Imagen principal actualizada correctamente'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la imagen principal: ' . $e->getMessage()
            ], 500);
        }
    }
}
