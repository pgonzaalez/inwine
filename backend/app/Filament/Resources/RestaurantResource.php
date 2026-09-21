<?php

namespace App\Filament\Resources;

use App\Filament\Resources\RestaurantResource\Pages;
use App\Filament\Resources\RestaurantResource\RelationManagers;
use App\Models\Restaurant;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class RestaurantResource extends Resource
{
    protected static ?string $model = Restaurant::class;

    protected static ?string $navigationIcon = 'heroicon-o-home-modern';

    protected static ?string $modelLabel = 'Restaurant';

    protected static ?string $pluralModelLabel = 'Restaurants';

    protected static ?string $navigationGroup = 'Restaurants';

    protected static ?int $navigationSort = 10;

    protected static ?string $recordTitleAttribute = 'business_name';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Group::make()
                    ->columnSpan(['lg' => 2])
                    ->schema([
                        Forms\Components\Section::make('Negoci')
                            ->columns(2)
                            ->schema([
                                Forms\Components\Select::make('user_id')
                                    ->label('Usuari')
                                    ->relationship('user', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->required()
                                    ->unique(ignoreRecord: true),
                                Forms\Components\TextInput::make('business_name')
                                    ->label('Nom comercial')
                                    ->required()
                                    ->maxLength(255),
                                Forms\Components\TextInput::make('province')
                                    ->label('Província')
                                    ->required()
                                    ->maxLength(255),
                                Forms\Components\TextInput::make('reference_number')
                                    ->label('Número de referència')
                                    ->maxLength(255),
                                Forms\Components\Textarea::make('description')
                                    ->label('Descripció')
                                    ->required()
                                    ->rows(3)
                                    ->columnSpanFull(),
                            ]),
                        Forms\Components\Section::make('Contacte')
                            ->columns(2)
                            ->schema([
                                Forms\Components\TextInput::make('name_contact')
                                    ->label('Persona de contacte')
                                    ->required()
                                    ->maxLength(255),
                                Forms\Components\TextInput::make('phone_contact')
                                    ->label('Telèfon')
                                    ->tel()
                                    ->required()
                                    ->maxLength(255),
                                Forms\Components\TextInput::make('address')
                                    ->label('Adreça')
                                    ->required()
                                    ->maxLength(255)
                                    ->columnSpanFull(),
                            ]),
                        Forms\Components\Section::make('Servei')
                            ->columns(2)
                            ->schema([
                                Forms\Components\TextInput::make('number_of_diners')
                                    ->label('Nombre de comensals')
                                    ->numeric()
                                    ->minValue(0),
                                Forms\Components\TextInput::make('workdays_per_week')
                                    ->label('Dies de servei per setmana')
                                    ->numeric()
                                    ->minValue(1)
                                    ->maxValue(7),
                                Forms\Components\TextInput::make('wine_rotation')
                                    ->label('Rotació de vins (per setmana)')
                                    ->numeric()
                                    ->minValue(0),
                                Forms\Components\CheckboxList::make('services')
                                    ->label('Serveis')
                                    ->options([
                                        'breakfast' => 'Esmorzar',
                                        'lunch' => 'Dinar',
                                        'dinner' => 'Sopar',
                                    ])
                                    ->columns(3)
                                    ->columnSpanFull(),
                            ]),
                        Forms\Components\Section::make('Finances')
                            ->columns(2)
                            ->schema([
                                Forms\Components\TextInput::make('balance')
                                    ->label('Saldo')
                                    ->numeric()
                                    ->prefix('€'),
                                Forms\Components\TextInput::make('credit_card')
                                    ->label('Targeta de crèdit')
                                    ->maxLength(255),
                            ]),
                    ]),
                Forms\Components\Group::make()
                    ->columnSpan(['lg' => 1])
                    ->schema([
                        Forms\Components\Section::make('Imatge')
                            ->schema([
                                Forms\Components\FileUpload::make('image')
                                    ->label('')
                                    ->image()
                                    ->disk('public')
                                    ->directory('restaurants')
                                    ->imageEditor(),
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
                    ->circular(),
                Tables\Columns\TextColumn::make('business_name')
                    ->label('Nom comercial')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Usuari')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('province')
                    ->label('Província')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('name_contact')
                    ->label('Contacte')
                    ->searchable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('phone_contact')
                    ->label('Telèfon')
                    ->toggleable(),
                Tables\Columns\TextColumn::make('number_of_diners')
                    ->label('Comensals')
                    ->sortable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('balance')
                    ->label('Saldo')
                    ->money('EUR')
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Registrat')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('province')
                    ->label('Província')
                    ->options(fn () => Restaurant::query()->distinct()->pluck('province', 'province')->filter()->all()),
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
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListRestaurants::route('/'),
            'create' => Pages\CreateRestaurant::route('/create'),
            'edit' => Pages\EditRestaurant::route('/{record}/edit'),
        ];
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['business_name', 'province', 'name_contact'];
    }

    public static function getNavigationBadge(): ?string
    {
        return (string) Restaurant::whereHas('user', fn (Builder $query) => $query->visibleToAdmins())->count();
    }

    public static function getEloquentQuery(): Builder
    {
        // Amaga el restaurant dels comptes de User::HIDDEN_EMAILS.
        return parent::getEloquentQuery()->whereHas('user', fn (Builder $query) => $query->visibleToAdmins());
    }
}
