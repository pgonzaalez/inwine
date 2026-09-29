<?php

namespace App\Filament\Resources\RequestRestaurantResource\RelationManagers;

use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class OrdersRequestedRelationManager extends RelationManager
{
    protected static string $relationship = 'ordersRequested';

    protected static ?string $title = 'Comandes pagades';

    protected static ?string $modelLabel = 'comanda';

    public function form(Form $form): Form
    {
        return $form->schema([]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('ID'),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Usuari'),
                Tables\Columns\TextColumn::make('status')
                    ->label('Estat')
                    ->badge(),
                Tables\Columns\TextColumn::make('total_price')
                    ->label('Total')
                    ->money('EUR'),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Data')
                    ->dateTime('d/m/Y H:i'),
            ])
            ->headerActions([])
            ->bulkActions([]);
    }

    public function canCreate(): bool
    {
        return false;
    }
}
