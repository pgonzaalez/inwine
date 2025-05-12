<?php

namespace App\Filament\Widgets;

use App\Models\User;
use Filament\Widgets\ChartWidget;

class UsersChart extends ChartWidget
{
    protected static ?string $heading = 'Usuaris registrats per mes';

    protected function getData(): array
    {
        $orders = User::selectRaw('MONTH(created_at) as month, COUNT(*) as total')
            ->whereYear('created_at', now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('total', 'month');

        // Preparamos 12 meses para asegurar que todos estén representados
        $labels = [];
        $data = [];

        for ($i = 1; $i <= 12; $i++) {
            $labels[] = now()->startOfYear()->addMonths($i - 1)->format('M'); // Ej: Jan, Feb
            $data[] = (int) ($orders[$i] ?? 0); // Asegura que sea entero
        }

        return [
            'datasets' => [
                [
                    'label' => 'Usuaris Registrats',
                    'data' => $data,
                    'fill' => 'start',
                    'backgroundColor' => 'rgba(59,130,246,0.4)',
                    'borderColor' => '#3b82f6',
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