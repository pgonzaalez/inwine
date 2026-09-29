<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SellerResource\Pages;
use App\Filament\Resources\SellerResource\RelationManagers;
use App\Models\Seller;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class SellerResource extends Resource
{
    protected static ?string $model = Seller::class;

    protected static ?string $navigationIcon = 'heroicon-o-building-storefront';

    protected static ?string $modelLabel = 'Celler';

    protected static ?string $pluralModelLabel = 'Cellers';

    protected static ?string $navigationGroup = "Gestió d'usuaris";

    protected static ?int $navigationSort = 20;

    protected static ?string $recordTitleAttribute = 'name_contact';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Dades del celler')
                    ->columns(2)
                    ->schema([
                        Forms\Components\Select::make('user_id')
                            ->label('Usuari')
                            ->relationship('user', 'name')
                            ->searchable()
                            ->preload()
                            ->required()
                            ->unique(ignoreRecord: true),
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
                Forms\Components\Section::make('Finances')
                    ->columns(2)
                    ->schema([
                        Forms\Components\TextInput::make('balance')
                            ->label('Saldo')
                            ->numeric()
                            ->prefix('€'),
                        Forms\Components\TextInput::make('bank_account')
                            ->label('Compte bancari')
                            ->maxLength(255),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Usuari')
                    ->sortable()
                    ->searchable()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('user.email')
                    ->label('Correu')
                    ->searchable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('name_contact')
                    ->label('Contacte')
                    ->searchable(),
                Tables\Columns\TextColumn::make('address')
                    ->label('Adreça')
                    ->toggleable(isToggledHiddenByDefault: true),
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
                //
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
            'index' => Pages\ListSellers::route('/'),
            'create' => Pages\CreateSeller::route('/create'),
            'edit' => Pages\EditSeller::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return (string) Seller::whereHas('user', fn (Builder $query) => $query->visibleToAdmins())->count();
    }

    public static function getEloquentQuery(): Builder
    {
        // Amaga el celler dels comptes de User::HIDDEN_EMAILS.
        return parent::getEloquentQuery()->whereHas('user', fn (Builder $query) => $query->visibleToAdmins());
    }
}
