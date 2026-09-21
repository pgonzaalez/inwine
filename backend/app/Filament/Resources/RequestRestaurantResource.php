<?php

namespace App\Filament\Resources;

use App\Filament\Resources\RequestRestaurantResource\Pages;
use App\Filament\Resources\RequestRestaurantResource\RelationManagers;
use App\Models\RequestRestaurant;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class RequestRestaurantResource extends Resource
{
    protected static ?string $model = RequestRestaurant::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static ?string $navigationGroup = 'Restaurants';

    protected static ?string $modelLabel = 'Petició';

    protected static ?string $pluralModelLabel = 'Peticions de restaurants';

    protected static ?int $navigationSort = 20;

    public const STATUSES = [
        'pending' => 'Pendent',
        'accepted' => 'Acceptada',
        'in_transit' => 'En trànsit',
        'in_my_local' => 'Al local',
        'sold' => 'Venuda',
    ];

    public const STATUS_COLORS = [
        'gray' => 'pending',
        'info' => 'accepted',
        'warning' => 'in_transit',
        'primary' => 'in_my_local',
        'success' => 'sold',
    ];

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Petició')
                    ->columns(2)
                    ->schema([
                        Forms\Components\Select::make('user_id')
                            ->label('Restaurant')
                            ->relationship('user', 'name')
                            ->searchable()
                            ->preload()
                            ->required(),
                        Forms\Components\Select::make('product_id')
                            ->label('Producte')
                            ->relationship('product', 'name')
                            ->searchable()
                            ->preload()
                            ->required(),
                        Forms\Components\TextInput::make('quantity')
                            ->label('Quantitat')
                            ->numeric()
                            ->minValue(1)
                            ->required(),
                        Forms\Components\TextInput::make('price_restaurant')
                            ->label('Preu pactat amb el restaurant')
                            ->numeric()
                            ->prefix('€')
                            ->required()
                            ->helperText('Recalcula automàticament les comissions en desar.'),
                        Forms\Components\Select::make('status')
                            ->label('Estat')
                            ->options(self::STATUSES)
                            ->required()
                            ->default('pending'),
                    ]),
                Forms\Components\Section::make('Repartiment (calculat)')
                    ->columns(3)
                    ->schema([
                        Forms\Components\TextInput::make('restaurant_earnings')
                            ->label('Guanys restaurant')
                            ->numeric()
                            ->prefix('€')
                            ->disabled(),
                        Forms\Components\TextInput::make('platform_earnings')
                            ->label('Guanys plataforma')
                            ->numeric()
                            ->prefix('€')
                            ->disabled(),
                        Forms\Components\TextInput::make('investor_earnings')
                            ->label('A pagar a l\'inversor (net)')
                            ->numeric()
                            ->prefix('€')
                            ->disabled()
                            ->helperText('Ja descompta la comissió de l\'inversor sobre el seu benefici.'),
                    ])
                    ->visibleOn('edit'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Restaurant')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('product.name')
                    ->label('Producte')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('product.seller.name')
                    ->label('Celler')
                    ->toggleable(),
                Tables\Columns\TextColumn::make('quantity')
                    ->label('Quantitat')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('price_restaurant')
                    ->label('Preu')
                    ->money('EUR')
                    ->sortable(),
                Tables\Columns\TextColumn::make('total')
                    ->label('Total')
                    ->getStateUsing(fn (RequestRestaurant $record): float => (float) $record->price_restaurant * (int) $record->quantity)
                    ->money('EUR'),
                Tables\Columns\TextColumn::make('platform_earnings')
                    ->label('Plataforma')
                    ->money('EUR')
                    ->toggleable(),
                Tables\Columns\TextColumn::make('investor_earnings')
                    ->label('A pagar a l\'inversor')
                    ->money('EUR')
                    ->toggleable(),
                Tables\Columns\TextColumn::make('status')
                    ->label('Estat')
                    ->badge()
                    ->colors(self::STATUS_COLORS)
                    ->formatStateUsing(fn (string $state): string => self::STATUSES[$state] ?? $state),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Data')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Estat')
                    ->options(self::STATUSES),
            ])
            ->actions([
                Tables\Actions\ActionGroup::make([
                    Tables\Actions\Action::make('advance')
                        ->label(fn (RequestRestaurant $record) => 'Marcar ' . strtolower(self::STATUSES[self::nextStatus($record->status)] ?? ''))
                        ->icon('heroicon-o-arrow-right-circle')
                        ->color('success')
                        ->visible(fn (RequestRestaurant $record) => self::nextStatus($record->status) !== null)
                        ->requiresConfirmation()
                        ->action(fn (RequestRestaurant $record) => $record->update(['status' => self::nextStatus($record->status)])),
                    Tables\Actions\EditAction::make(),
                    Tables\Actions\DeleteAction::make(),
                ]),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function nextStatus(string $status): ?string
    {
        $order = array_keys(self::STATUSES);
        $index = array_search($status, $order, true);

        if ($index === false || ! isset($order[$index + 1])) {
            return null;
        }

        return $order[$index + 1];
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\OrdersRequestedRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListRequestRestaurants::route('/'),
            'create' => Pages\CreateRequestRestaurant::route('/create'),
            'edit' => Pages\EditRequestRestaurant::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return (string) RequestRestaurant::where('status', 'pending')->count();
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'warning';
    }
}
