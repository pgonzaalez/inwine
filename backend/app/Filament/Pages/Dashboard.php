<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use App\Filament\Widgets\OrdersChart;
use App\Filament\Widgets\UsersChart;
use App\Filament\Widgets\LatestOrders;
use App\Filament\Widgets\StatsOverview;
use App\Filament\Widgets\RequestsByStatusChart;
use App\Filament\Widgets\PendingRequestsWidget;
use Filament\Widgets\AccountWidget;

class Dashboard extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-home';

    protected static ?string $navigationLabel = 'Tauler';

    protected static ?string $title = 'Tauler de control';

    protected static string $view = 'filament.pages.dashboard';

    protected function getHeaderWidgets(): array
    {
        return [
            AccountWidget::class,
            StatsOverview::class,
        ];
    }

    protected function getFooterWidgets(): array
    {
        return [
            PendingRequestsWidget::class,
            OrdersChart::class,
            UsersChart::class,
            RequestsByStatusChart::class,
            LatestOrders::class,
        ];
    }

    public function getFooterWidgetsColumns(): int|string|array
    {
        return 2;
    }
}
