<?php

namespace App\Filament\Resources\ProductResource\Widgets;

use App\Models\Product; // Asegúrate de importar tu modelo
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class ProductOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Products', Product::count()),
        ];
    }
}
