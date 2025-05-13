<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use App\Filament\Widgets\OrdersChart;
use App\Filament\Widgets\UsersChart;
use App\Filament\Widgets\LatestOrders;
use App\Filament\Widgets\StatsOverview;
use Filament\Widgets\AccountWidget;

class Dashboard extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-home';

    protected static string $view = 'filament.pages.dashboard';

    protected function getHeaderWidgets(): array
    {
        return [
            AccountWidget::class,
        ];
    }

    protected function getFooterWidgets(): array
    {
        return [
            StatsOverview::class,
            OrdersChart::class,
            UsersChart::class,
            LatestOrders::class,
        ];
    }

}
