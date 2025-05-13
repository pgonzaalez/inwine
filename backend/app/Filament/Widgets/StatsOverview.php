<?php

namespace App\Filament\Widgets;

use App\Models\User;
use App\Models\Product;
use App\Models\OrderRequested;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        // Obtener el número total de usuarios y productos
        $totalUsers = User::count();
        $totalProducts = Product::count();
        $totalSales = OrderRequested::sum('total_price');

        // Formatear los números para mostrar de forma más legible (por ejemplo, en miles o millones)
        $formatNumber = function (int $number): string {
            if ($number < 1000) {
                return (string) number_format($number, 0);
            }

            if ($number < 1000000) {
                return number_format($number / 1000, 2) . 'k';
            }

            return number_format($number / 1000000, 2) . 'm';
        };

        return [
            // Widget para los usuarios totales
            Stat::make('Total Usuarios', $formatNumber($totalUsers))
                ->description('Usuarios activos')
                ->descriptionIcon('heroicon-m-user-group')
                ->chart([100, 120, 130, 140, 160])  // Aquí puedes agregar un gráfico si lo deseas
                ->color('primary'),

            // Widget para los productos totales
            Stat::make('Total Productos', $formatNumber($totalProducts))
                ->description('Productos en stock')
                ->descriptionIcon('heroicon-m-cube')
                ->chart([50, 60, 70, 80, 90])  // Agregar gráfico si lo deseas
                ->color('secondary'),

            Stat::make('Ventas Totales', '$' . $formatNumber($totalSales))
                ->description('Ingresos generados')
                ->descriptionIcon('heroicon-m-currency-dollar')
                ->color('success'),
        ];
    }
}
