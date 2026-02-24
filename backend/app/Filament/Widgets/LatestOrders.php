<?php

namespace App\Filament\Widgets;

use App\Models\OrderRequested;
use Filament\Widgets\TableWidget as BaseWidget;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Eloquent\Builder;

class LatestOrders extends BaseWidget
{
    protected static ?string $heading = 'Últimes 10 Comandes';

    protected int | string | array $columnSpan = 'full';

    protected function getTableQuery(): Builder
    {
        return OrderRequested::query()->latest()->limit(10);
    }

    protected function getTableColumns(): array
    {
        return [
            TextColumn::make('id')
                ->label('ID'),
            TextColumn::make('user.name')
                ->label('Usuari')
                ->sortable()
                ->searchable(),
            TextColumn::make('requestRestaurant.product.name')
                ->label('Producte')
                ->sortable()
                ->searchable(),
            TextColumn::make('requestRestaurant.quantity')
                ->label('Quantitat')
                ->sortable(),
            TextColumn::make('total_price')
                ->label('Preu')
                ->money('EUR')
                ->sortable(),
            TextColumn::make('created_at')
                ->label('Data')
                ->dateTime('d/m/Y H:i'),
        ];
    }
}
