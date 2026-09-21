<?php

namespace App\Filament\Widgets;

use App\Models\Investor;
use App\Models\OrderRequested;
use App\Models\Product;
use App\Models\RequestRestaurant;
use App\Models\Restaurant;
use App\Models\Seller;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        $totalUsers = User::count();
        $totalProducts = Product::count();
        $totalSales = (float) OrderRequested::sum('total_price');
        $platformEarnings = (float) RequestRestaurant::sum('platform_earnings');
        $pendingRequests = RequestRestaurant::where('status', 'pending')->count();

        return [
            Stat::make('Usuaris', number_format($totalUsers, 0, ',', '.'))
                ->description(Restaurant::count() . ' restaurants · ' . Seller::count() . ' cellers · ' . Investor::count() . ' inversors')
                ->descriptionIcon('heroicon-m-user-group')
                ->color('primary'),

            Stat::make('Productes al catàleg', number_format($totalProducts, 0, ',', '.'))
                ->description(Product::where('status', 'in_stock')->count() . ' en estoc')
                ->descriptionIcon('heroicon-m-cube')
                ->color('gray'),

            Stat::make('Peticions pendents', (string) $pendingRequests)
                ->description('Requereixen acció d\'un celler o de la plataforma')
                ->descriptionIcon('heroicon-m-clock')
                ->color($pendingRequests > 0 ? 'warning' : 'success'),

            Stat::make('Vendes totals', number_format($totalSales, 2, ',', '.') . ' €')
                ->description('Ingressos generats per comandes pagades')
                ->descriptionIcon('heroicon-m-currency-euro')
                ->color('success'),

            Stat::make('Comissió de plataforma', number_format($platformEarnings, 2, ',', '.') . ' €')
                ->description('Acumulada sobre totes les peticions')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('success'),
        ];
    }
}
