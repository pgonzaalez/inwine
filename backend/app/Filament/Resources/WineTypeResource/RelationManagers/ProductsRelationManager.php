<?php

namespace App\Filament\Resources\WineTypeResource\RelationManagers;

use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class ProductsRelationManager extends RelationManager
{
    protected static string $relationship = 'products';

    protected static ?string $title = 'Productes';

    protected static ?string $modelLabel = 'producte';

    public function form(Form $form): Form
    {
        return $form->schema([]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
                Tables\Columns\ImageColumn::make('image')
                    ->label('')
                    ->square(),
                Tables\Columns\TextColumn::make('name')
                    ->label('Nom')
                    ->searchable(),
                Tables\Columns\TextColumn::make('seller.name')
                    ->label('Celler'),
                Tables\Columns\TextColumn::make('price_demanded')
                    ->label('Preu')
                    ->money('EUR'),
                Tables\Columns\TextColumn::make('status')
                    ->label('Estat')
                    ->badge(),
            ])
            ->actions([
                Tables\Actions\Action::make('edit')
                    ->label('Editar')
                    ->icon('heroicon-o-pencil-square')
                    ->url(fn ($record) => \App\Filament\Resources\ProductResource::getUrl('edit', ['record' => $record])),
            ]);
    }

    public function canCreate(): bool
    {
        return false;
    }
}
