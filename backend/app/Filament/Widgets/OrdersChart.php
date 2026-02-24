<?php

namespace App\Filament\Widgets;

use App\Models\OrderRequested;
use Filament\Widgets\ChartWidget;

class OrdersChart extends ChartWidget
{
    protected static ?string $heading = 'Comandes per mes';

    protected function getData(): array
    {
        $orders = OrderRequested::selectRaw('MONTH(created_at) as month, COUNT(*) as total')
            ->whereYear('created_at', now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('total', 'month');

        $data = [];
        $labels = [];

        for ($i = 1; $i <= 12; $i++) {
            $labels[] = now()->startOfYear()->addMonths($i - 1)->format('M'); // Ej: Jan, Feb
            $data[] = (int) ($orders[$i] ?? 0); // Asegura que sea entero
        }

        return [
            'datasets' => [
                [
                    'label' => 'Comandes',
                    'data' => $data,
                    'backgroundColor' => 'rgba(59,130,246,0.4)',
                    'borderColor' => '#3b82f6',
                    'fill' => 'start',
                    'pointBackgroundColor' => '#3b82f6',
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
