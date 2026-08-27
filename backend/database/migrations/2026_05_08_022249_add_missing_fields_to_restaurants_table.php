<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('restaurants', function (Blueprint $table) {
            if (!Schema::hasColumn('restaurants', 'image')) {
                $table->string('image')->nullable();
            }
            if (!Schema::hasColumn('restaurants', 'province')) {
                $table->string('province');
            }
            if (!Schema::hasColumn('restaurants', 'description')) {
                $table->string('description');
            }
            if (!Schema::hasColumn('restaurants', 'number_of_diners')) {
                $table->integer('number_of_diners')->nullable();
            }
            if (!Schema::hasColumn('restaurants', 'wine_rotation')) {
                $table->unsignedInteger('wine_rotation')->nullable();
            } else {
                $table->unsignedInteger('wine_rotation')->nullable()->change();
            }
            if (!Schema::hasColumn('restaurants', 'business_name')) {
                $table->string('business_name');
            }
            if (!Schema::hasColumn('restaurants', 'reference_number')) {
                $table->string('reference_number')->nullable();
            }
            if (!Schema::hasColumn('restaurants', 'workdays_per_week')) {
                $table->unsignedTinyInteger('workdays_per_week')->nullable();
            }
            if (!Schema::hasColumn('restaurants', 'services')) {
                $table->json('services')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('restaurants', function (Blueprint $table) {
            $cols = ['image', 'province', 'description', 'number_of_diners', 'wine_rotation',
                     'business_name', 'reference_number', 'workdays_per_week', 'services'];
            $existing = array_values(array_filter($cols, fn($c) => Schema::hasColumn('restaurants', $c)));
            if ($existing) {
                $table->dropColumn($existing);
            }
        });
    }
};
