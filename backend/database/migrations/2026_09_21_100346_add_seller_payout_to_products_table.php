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
        Schema::table('products', function (Blueprint $table) {
            // Import net que rep el celler/bodega un cop descomptada la seva
            // comissió ("Comissió pel producte"). Es recalcula, com
            // price_demanded_with_commission, cada cop que es desa el producte.
            $table->float('seller_payout')->default(0)->after('commission_platform');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('seller_payout');
        });
    }
};
