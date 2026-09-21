<?php

namespace App\Filament\Widgets;

use App\Models\RequestRestaurant;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Actions\Action;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use Illuminate\Database\Eloquent\Builder;

class PendingRequestsWidget extends BaseWidget
{
    protected static ?string $heading = 'Peticions pendents d\'acció';

    protected int|string|array $columnSpan = 'full';

    protected static ?int $sort = 6;

    public function table(Table $table): Table
    {
        return $table
            ->query(
                RequestRestaurant::query()
                    ->where('status', 'pending')
                    ->latest()
            )
            ->columns([
                TextColumn::make('user.name')
                    ->label('Restaurant')
                    ->searchable(),
                TextColumn::make('product.name')
                    ->label('Producte')
                    ->searchable(),
                TextColumn::make('quantity')
                    ->label('Quantitat'),
                TextColumn::make('price_restaurant')
                    ->label('Preu')
                    ->money('EUR'),
                TextColumn::make('created_at')
                    ->label('Sol·licitada')
                    ->dateTime('d/m/Y H:i'),
            ])
            ->actions([
                Action::make('accept')
                    ->label('Acceptar')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->action(fn (RequestRestaurant $record) => $record->update(['status' => 'accepted'])),
                Action::make('view')
                    ->label('Veure')
                    ->icon('heroicon-o-eye')
                    ->url(fn (RequestRestaurant $record) => \App\Filament\Resources\RequestRestaurantResource::getUrl('edit', ['record' => $record])),
            ])
            ->emptyStateHeading('Cap petició pendent')
            ->emptyStateDescription('Totes les peticions dels restaurants estan gestionades.')
            ->emptyStateIcon('heroicon-o-check-badge')
            ->paginated([5, 10, 25]);
    }
}
