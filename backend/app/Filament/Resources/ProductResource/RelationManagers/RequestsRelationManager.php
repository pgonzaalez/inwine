<?php

namespace App\Filament\Resources\ProductResource\RelationManagers;

use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class RequestsRelationManager extends RelationManager
{
    protected static string $relationship = 'requestsRestaurant';

    protected static ?string $title = 'Peticions de restaurants';

    protected static ?string $modelLabel = 'petició';

    public function form(Form $form): Form
    {
        return $form->schema([]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Restaurant'),
                Tables\Columns\TextColumn::make('quantity')
                    ->label('Quantitat'),
                Tables\Columns\TextColumn::make('price_restaurant')
                    ->label('Preu restaurant')
                    ->money('EUR'),
                Tables\Columns\TextColumn::make('status')
                    ->label('Estat')
                    ->badge()
                    ->colors([
                        'gray' => 'pending',
                        'info' => 'accepted',
                        'warning' => 'in_transit',
                        'primary' => 'in_my_local',
                        'success' => 'sold',
                    ]),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Data')
                    ->dateTime('d/m/Y H:i'),
            ])
            ->headerActions([])
            ->actions([
                Tables\Actions\Action::make('view')
                    ->label('Veure')
                    ->icon('heroicon-o-eye')
                    ->url(fn ($record) => \App\Filament\Resources\RequestRestaurantResource::getUrl('edit', ['record' => $record])),
            ])
            ->bulkActions([]);
    }

    public function canCreate(): bool
    {
        return false;
    }
}
