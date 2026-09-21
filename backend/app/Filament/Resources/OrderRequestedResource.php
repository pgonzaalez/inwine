<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderRequestedResource\Pages;
use App\Filament\Resources\OrderRequestedResource\RelationManagers;
use App\Models\OrderRequested;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class OrderRequestedResource extends Resource
{
    protected static ?string $model = OrderRequested::class;

    protected static ?string $navigationIcon = 'heroicon-o-clipboard-document-check';

    protected static ?string $navigationGroup = 'Comandes i pagaments';

    protected static ?string $modelLabel = 'Comanda pagada';

    protected static ?string $pluralModelLabel = 'Comandes pagades';

    protected static ?int $navigationSort = 20;

    public const STATUSES = [
        'paid' => 'Pagada',
        'shipped' => 'Enviada',
        'waiting' => 'En espera',
        'completed' => 'Completada',
    ];

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Comanda')
                    ->columns(2)
                    ->schema([
                        Forms\Components\Select::make('user_id')
                            ->label('Restaurant')
                            ->relationship('user', 'name')
                            ->searchable()
                            ->preload()
                            ->required(),
                        Forms\Components\Select::make('request_restaurant_id')
                            ->label('Petició')
                            ->relationship('requestRestaurant', 'id')
                            ->getOptionLabelFromRecordUsing(fn ($record) => "#{$record->id} — {$record->product?->name}")
                            ->searchable()
                            ->preload()
                            ->required(),
                        Forms\Components\Select::make('status')
                            ->label('Estat')
                            ->options(self::STATUSES)
                            ->required()
                            ->default('paid'),
                        Forms\Components\TextInput::make('total_price')
                            ->label('Preu total')
                            ->numeric()
                            ->prefix('€')
                            ->required(),
                        Forms\Components\TextInput::make('investor_earnings')
                            ->label('A pagar a l\'inversor (registrat)')
                            ->numeric()
                            ->prefix('€'),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('ID')
                    ->sortable(),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Restaurant')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('requestRestaurant.product.name')
                    ->label('Producte')
                    ->searchable(),
                Tables\Columns\TextColumn::make('status')
                    ->label('Estat')
                    ->badge()
                    ->colors([
                        'warning' => 'paid',
                        'info' => 'shipped',
                        'gray' => 'waiting',
                        'success' => 'completed',
                    ])
                    ->formatStateUsing(fn (string $state): string => self::STATUSES[$state] ?? $state),
                Tables\Columns\TextColumn::make('total_price')
                    ->label('Total')
                    ->money('EUR')
                    ->sortable(),
                Tables\Columns\TextColumn::make('platform_earnings')
                    ->label('Plataforma')
                    ->money('EUR')
                    ->toggleable(),
                Tables\Columns\TextColumn::make('investor_earnings')
                    ->label('A pagar a l\'inversor')
                    ->money('EUR')
                    ->toggleable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Data')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Estat')
                    ->options(self::STATUSES),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
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
            'index' => Pages\ListOrderRequesteds::route('/'),
            'create' => Pages\CreateOrderRequested::route('/create'),
            'edit' => Pages\EditOrderRequested::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return (string) OrderRequested::whereIn('status', ['paid', 'waiting'])->count();
    }
}
