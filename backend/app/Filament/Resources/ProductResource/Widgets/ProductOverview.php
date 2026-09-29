<?php

namespace App\Filament\Resources\ProductResource\Widgets;

use App\Models\Product;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class ProductOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total productes', Product::count())
                ->icon('heroicon-o-cube')
                ->color('gray'),
            Stat::make('En estoc', Product::where('status', 'in_stock')->count())
                ->icon('heroicon-o-archive-box')
                ->color('success'),
            Stat::make('Sense estoc', Product::where('quantity', '<=', 0)->count())
                ->icon('heroicon-o-exclamation-triangle')
                ->color('danger'),
            Stat::make('Venuts', Product::where('status', 'sold')->count())
                ->icon('heroicon-o-check-circle')
                ->color('primary'),
        ];
    }
}
