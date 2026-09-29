<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Filament\Resources\ProductResource\RelationManagers;
use App\Filament\Resources\ProductResource\Widgets\ProductOverview;
use App\Models\Product;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-o-cube';

    protected static ?string $modelLabel = 'Producte';

    protected static ?string $pluralModelLabel = 'Productes';

    protected static ?string $navigationGroup = 'Catàleg';

    protected static ?int $navigationSort = 10;

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Group::make()
                    ->columnSpan(['lg' => 2])
                    ->schema([
                        Forms\Components\Section::make('Informació del vi')
                            ->columns(2)
                            ->schema([
                                Forms\Components\TextInput::make('name')
                                    ->label('Nom')
                                    ->required()
                                    ->maxLength(255)
                                    ->columnSpanFull(),
                                Forms\Components\TextInput::make('origin')
                                    ->label('Origen / D.O.')
                                    ->required()
                                    ->maxLength(255),
                                Forms\Components\TextInput::make('year')
                                    ->label('Anyada')
                                    ->numeric()
                                    ->minValue(1900)
                                    ->maxValue((int) date('Y'))
                                    ->required(),
                                Forms\Components\Select::make('wine_type_id')
                                    ->label('Tipus de vi')
                                    ->relationship('wineType', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->required(),
                                Forms\Components\Select::make('user_id')
                                    ->label('Celler / venedor')
                                    ->relationship('seller', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->required(),
                                Forms\Components\Textarea::make('description')
                                    ->label('Descripció')
                                    ->required()
                                    ->rows(4)
                                    ->columnSpanFull(),
                            ]),
                        Forms\Components\Section::make('Preu i estoc')
                            ->columns(3)
                            ->schema([
                                Forms\Components\TextInput::make('price_demanded')
                                    ->label('Preu demanat pel celler')
                                    ->numeric()
                                    ->prefix('€')
                                    ->required()
                                    ->live(onBlur: true),
                                Forms\Components\TextInput::make('price_demanded_with_commission')
                                    ->label('Preu final (amb comissió)')
                                    ->numeric()
                                    ->prefix('€')
                                    ->disabled()
                                    ->dehydrated(false)
                                    ->helperText('Es calcula automàticament amb la comissió de plataforma vigent.'),
                                Forms\Components\TextInput::make('commission_platform')
                                    ->label('Comissió plataforma')
                                    ->numeric()
                                    ->prefix('€')
                                    ->disabled()
                                    ->dehydrated(false),
                                Forms\Components\TextInput::make('seller_payout')
                                    ->label('A pagar al celler')
                                    ->numeric()
                                    ->prefix('€')
                                    ->disabled()
                                    ->dehydrated(false)
                                    ->helperText('Preu demanat menys la comissió del celler. Import net a transferir-li.'),
                                Forms\Components\TextInput::make('quantity')
                                    ->label('Quantitat en estoc')
                                    ->numeric()
                                    ->minValue(0)
                                    ->required(),
                                Forms\Components\Select::make('status')
                                    ->label('Estat')
                                    ->options([
                                        'in_stock' => 'En estoc',
                                        'requested' => 'Sol·licitat',
                                        'in_transit' => 'En trànsit',
                                        'sold' => 'Venut',
                                    ])
                                    ->required()
                                    ->default('in_stock'),
                                Forms\Components\Select::make('parent_product_id')
                                    ->label('Producte pare (lot)')
                                    ->relationship(name: 'parentProduct', titleAttribute: 'name', ignoreRecord: true)
                                    ->searchable()
                                    ->preload()
                                    ->helperText('Només si aquest producte és un duplicat d\'un altre lot.'),
                            ]),
                    ]),
                Forms\Components\Group::make()
                    ->columnSpan(['lg' => 1])
                    ->schema([
                        Forms\Components\Section::make('Imatge principal')
                            ->schema([
                                Forms\Components\FileUpload::make('image')
                                    ->label('')
                                    ->image()
                                    ->disk('public')
                                    ->directory('products')
                                    ->imageEditor()
                                    ->required(),
                            ]),
                    ]),
            ])
            ->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')
                    ->label('')
                    ->square(),
                Tables\Columns\TextColumn::make('name')
                    ->label('Nom')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('origin')
                    ->label('Origen')
                    ->searchable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('year')
                    ->label('Anyada')
                    ->sortable(),
                Tables\Columns\TextColumn::make('wineType.name')
                    ->label('Tipus')
                    ->badge()
                    ->color('gray')
                    ->sortable(),
                Tables\Columns\TextColumn::make('seller.name')
                    ->label('Celler')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('price_demanded')
                    ->label('Preu')
                    ->money('EUR')
                    ->sortable(),
                Tables\Columns\TextColumn::make('price_demanded_with_commission')
                    ->label('Preu final')
                    ->money('EUR')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('seller_payout')
                    ->label('A pagar al celler')
                    ->money('EUR')
                    ->sortable()
                    ->color('success'),
                Tables\Columns\TextColumn::make('quantity')
                    ->label('Estoc')
                    ->numeric()
                    ->sortable()
                    ->color(fn (int $state): string => $state <= 0 ? 'danger' : 'gray'),
                Tables\Columns\TextColumn::make('status')
                    ->label('Estat')
                    ->badge()
                    ->colors([
                        'gray' => 'in_stock',
                        'warning' => 'requested',
                        'info' => 'in_transit',
                        'success' => 'sold',
                    ])
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'in_stock' => 'En estoc',
                        'requested' => 'Sol·licitat',
                        'in_transit' => 'En trànsit',
                        'sold' => 'Venut',
                        default => $state,
                    }),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Creat')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Actualitzat')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Estat')
                    ->options([
                        'in_stock' => 'En estoc',
                        'requested' => 'Sol·licitat',
                        'in_transit' => 'En trànsit',
                        'sold' => 'Venut',
                    ]),
                Tables\Filters\SelectFilter::make('wine_type_id')
                    ->label('Tipus de vi')
                    ->relationship('wineType', 'name'),
                Tables\Filters\SelectFilter::make('user_id')
                    ->label('Celler')
                    ->relationship('seller', 'name')
                    ->searchable(),
                Tables\Filters\Filter::make('sense_estoc')
                    ->label('Sense estoc')
                    ->query(fn (\Illuminate\Database\Eloquent\Builder $query) => $query->where('quantity', '<=', 0)),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
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
        return [
            RelationManagers\ImagesRelationManager::class,
            RelationManagers\RequestsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['name', 'origin'];
    }

    public static function getNavigationBadge(): ?string
    {
        return (string) Product::count();
    }

    public static function getWidgets(): array
    {
        return [
            ProductOverview::class,
        ];
    }
}
