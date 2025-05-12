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
        Schema::create('commissions', function (Blueprint $table) {
            $table->id();
            $table->decimal('percentage_to_seller', 5, 2); 
            $table->decimal('percentage_to_restaurant', 5, 2);
            $table->decimal('percentage_to_investor', 5, 2);

            // // Ejemplo
            // $table->string('slug');
            // $table->enum('who', ['seller', 'restaurant', 'investor'])->default('seller');
            // $table->decimal('percentage', 5, 2)->default(0.00);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commissions');
    }
};
