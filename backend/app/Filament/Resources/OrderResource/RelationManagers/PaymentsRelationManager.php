<?php

namespace App\Filament\Resources\OrderResource\RelationManagers;

use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class PaymentsRelationManager extends RelationManager
{
    protected static string $relationship = 'payments';

    protected static ?string $title = 'Pagaments Stripe';

    protected static ?string $modelLabel = 'pagament';

    public function form(Form $form): Form
    {
        return $form->schema([]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('stripe_payment_intent_id')
                    ->label('Payment Intent')
                    ->copyable(),
                Tables\Columns\TextColumn::make('status')
                    ->label('Estat')
                    ->badge(),
                Tables\Columns\TextColumn::make('amount')
                    ->label('Import')
                    ->money('eur', divideBy: 100),
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
