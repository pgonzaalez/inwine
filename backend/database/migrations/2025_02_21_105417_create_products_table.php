<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('origin');
            $table->integer('year');
            $table->unsignedBigInteger('wine_type_id');
            $table->string('description');
            $table->float('price_demanded');
            $table->float('price_demanded_with_commission');
            $table->integer('quantity');
            $table->string('image')->nullable();
            $table->enum('status', ['in_stock','requested','in_transit', 'sold'])->default('in_stock');
            $table->unsignedBigInteger('user_id');

            $table->foreign('wine_type_id')->references('id')->on('wine_types');
            $table->foreign('user_id')->references('id')->on('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
