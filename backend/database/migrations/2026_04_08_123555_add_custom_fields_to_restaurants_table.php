<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('restaurants', function (Blueprint $table) {
            if (!Schema::hasColumn('restaurants', 'business_name')) {
                $table->string('business_name')->after('balance');
            }
            if (!Schema::hasColumn('restaurants', 'reference_number')) {
                $table->string('reference_number')->nullable()->after('business_name');
            }
            if (!Schema::hasColumn('restaurants', 'workdays_per_week')) {
                $table->unsignedTinyInteger('workdays_per_week')->nullable()->after('reference_number');
            }
            if (!Schema::hasColumn('restaurants', 'services')) {
                $table->json('services')->nullable()->after('workdays_per_week');
            }
        });

        // Change wine_rotation to integer if it is still a string column
        Schema::table('restaurants', function (Blueprint $table) {
            $table->unsignedInteger('wine_rotation')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('restaurants', function (Blueprint $table) {
            $cols = ['business_name', 'reference_number', 'workdays_per_week', 'services'];
            $existing = array_filter($cols, fn($c) => Schema::hasColumn('restaurants', $c));
            if ($existing) {
                $table->dropColumn(array_values($existing));
            }
            if (Schema::hasColumn('restaurants', 'wine_rotation')) {
                $table->string('wine_rotation')->default('unknown')->change();
            }
        });
    }
};
