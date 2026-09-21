<?php

namespace App\Filament\Widgets;

use App\Models\RequestRestaurant;
use Filament\Widgets\ChartWidget;

class RequestsByStatusChart extends ChartWidget
{
    protected static ?string $heading = 'Peticions de restaurants per estat';

    protected static ?int $sort = 5;

    protected function getData(): array
    {
        $labels = [
            'pending' => 'Pendent',
            'accepted' => 'Acceptada',
            'in_transit' => 'En trànsit',
            'in_my_local' => 'Al local',
            'sold' => 'Venuda',
        ];

        $counts = RequestRestaurant::selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return [
            'datasets' => [
                [
                    'label' => 'Peticions',
                    'data' => array_map(fn ($status) => (int) ($counts[$status] ?? 0), array_keys($labels)),
                    'backgroundColor' => ['#94a3b8', '#38bdf8', '#f59e0b', '#818cf8', '#22c55e'],
                ],
            ],
            'labels' => array_values($labels),
        ];
    }

    protected function getType(): string
    {
        return 'doughnut';
    }
}
