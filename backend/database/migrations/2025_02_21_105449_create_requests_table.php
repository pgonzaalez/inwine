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
        Schema::create('requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('restaurant_id');
            $table->unsignedBigInteger('inversor_id');
            $table->unsignedBigInteger('product_id');
            $table->integer('price_offer');
            $table->enum('status', ['pending', 'accepted', 'rejected']);
            $table->foreign('restaurant_id')->references('id')->on('users');
            $table->foreign('inversor_id')->references('id')->on('users');
            $table->foreign('product_id')->references('id')->on('products');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requests');
    }
};
