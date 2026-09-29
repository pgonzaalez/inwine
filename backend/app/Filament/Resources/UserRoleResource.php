<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserRoleResource\Pages;
use App\Filament\Resources\UserRoleResource\RelationManagers;
use App\Models\UserRole;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class UserRoleResource extends Resource
{
    protected static ?string $model = UserRole::class;

    protected static ?string $navigationIcon = 'heroicon-o-shield-check';

    protected static ?string $modelLabel = 'Rol';

    protected static ?string $pluralModelLabel = 'Rols d\'usuari';

    protected static ?string $navigationGroup = "Gestió d'usuaris";

    protected static ?int $navigationSort = 40;

    public const ROLES = [
        'seller' => 'Celler',
        'investor' => 'Inversor',
        'restaurant' => 'Restaurant',
    ];

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('user_id')
                    ->label('Usuari')
                    ->relationship('user', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),
                Forms\Components\Select::make('role')
                    ->label('Rol')
                    ->options(self::ROLES)
                    ->required(),
                Forms\Components\Toggle::make('is_active')
                    ->label('Actiu')
                    ->helperText('Rol actualment seleccionat per l\'usuari a l\'app.'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Usuari')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('user.email')
                    ->label('Correu')
                    ->searchable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('role')
                    ->label('Rol')
                    ->badge()
                    ->colors([
                        'success' => 'seller',
                        'info' => 'investor',
                        'warning' => 'restaurant',
                    ])
                    ->formatStateUsing(fn (string $state): string => self::ROLES[$state] ?? $state),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Actiu')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Creat')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('role')
                    ->label('Rol')
                    ->options(self::ROLES),
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Actiu'),
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
            'index' => Pages\ListUserRoles::route('/'),
            'create' => Pages\CreateUserRole::route('/create'),
            'edit' => Pages\EditUserRole::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        // Amaga els rols dels comptes de User::HIDDEN_EMAILS.
        return parent::getEloquentQuery()->whereHas('user', fn (Builder $query) => $query->visibleToAdmins());
    }
}
