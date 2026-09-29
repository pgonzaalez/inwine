<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PaymentResource\Pages;
use App\Filament\Resources\PaymentResource\RelationManagers;
use App\Models\Payment;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class PaymentResource extends Resource
{
    protected static ?string $model = Payment::class;

    protected static ?string $navigationIcon = 'heroicon-o-banknotes';

    protected static ?string $modelLabel = 'Pagament';

    protected static ?string $pluralModelLabel = 'Pagaments';

    protected static ?string $navigationGroup = 'Comandes i pagaments';

    protected static ?int $navigationSort = 30;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make()
                    ->columns(2)
                    ->schema([
                        Forms\Components\Select::make('order_id')
                            ->label('Comanda')
                            ->relationship('order', 'id')
                            ->getOptionLabelFromRecordUsing(fn ($record) => "#{$record->id} — {$record->user?->name}")
                            ->searchable()
                            ->preload()
                            ->helperText('Pot quedar buida si la comanda ja s\'ha convertit en comanda pagada.'),
                        Forms\Components\TextInput::make('stripe_payment_intent_id')
                            ->label('Stripe Payment Intent')
                            ->required()
                            ->maxLength(255)
                            ->copyable(),
                        Forms\Components\Select::make('status')
                            ->label('Estat')
                            ->options([
                                'requires_payment_method' => 'Requereix mètode de pagament',
                                'requires_confirmation' => 'Requereix confirmació',
                                'requires_action' => 'Requereix acció',
                                'processing' => 'Processant',
                                'succeeded' => 'Completat',
                                'canceled' => 'Cancel·lat',
                            ])
                            ->required(),
                        Forms\Components\TextInput::make('amount')
                            ->label('Import (cèntims)')
                            ->numeric()
                            ->required()
                            ->helperText('Import en cèntims, tal com el retorna Stripe.'),
                        Forms\Components\TextInput::make('currency')
                            ->label('Moneda')
                            ->required()
                            ->maxLength(255)
                            ->default('eur'),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('order_id')
                    ->label('Comanda')
                    ->numeric()
                    ->sortable()
                    ->placeholder('—'),
                Tables\Columns\TextColumn::make('stripe_payment_intent_id')
                    ->label('Payment Intent')
                    ->searchable()
                    ->copyable()
                    ->limit(24),
                Tables\Columns\TextColumn::make('status')
                    ->label('Estat')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'succeeded' => 'success',
                        'canceled' => 'danger',
                        'requires_payment_method' => 'gray',
                        default => 'warning',
                    }),
                Tables\Columns\TextColumn::make('amount')
                    ->label('Import')
                    ->money(fn ($record) => $record->currency ?? 'eur', divideBy: 100)
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Data')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Estat')
                    ->options([
                        'requires_payment_method' => 'Requereix mètode de pagament',
                        'requires_confirmation' => 'Requereix confirmació',
                        'requires_action' => 'Requereix acció',
                        'processing' => 'Processant',
                        'succeeded' => 'Completat',
                        'canceled' => 'Cancel·lat',
                    ]),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPayments::route('/'),
            'create' => Pages\CreatePayment::route('/create'),
            'edit' => Pages\EditPayment::route('/{record}/edit'),
        ];
    }
}
