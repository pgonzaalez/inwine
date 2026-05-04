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
        Schema::create('restaurants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('address');
            $table->integer('phone_contact');
            $table->string('name_contact');
            $table->string('credit_card')->nullable();
            $table->decimal('balance', 10, 2)->nullable();
            $table->string('business_name');
            $table->string('image')->nullable();
            $table->string('province');
            $table->string('description');
            $table->integer('number_of_diners')->nullable();
            $table->string('wine_rotation');
            $table->integer('reference_number')->nullable();
            $table->string('shifts')->default('unknown');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('restaurants');
    }
};
