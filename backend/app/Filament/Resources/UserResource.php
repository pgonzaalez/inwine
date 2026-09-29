<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Filament\Resources\UserResource\RelationManagers;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Hash;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-user-group';

    protected static ?string $modelLabel = 'Usuari';

    protected static ?string $pluralModelLabel = 'Usuaris';

    protected static ?string $navigationGroup = "Gestió d'usuaris";

    protected static ?int $navigationSort = 10;

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Dades personals')
                    ->columns(2)
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Nom')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('NIF')
                            ->label('NIF')
                            ->required()
                            ->maxLength(9),
                        Forms\Components\TextInput::make('email')
                            ->label('Correu electrònic')
                            ->email()
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true),
                        Forms\Components\DateTimePicker::make('email_verified_at')
                            ->label('Verificat el')
                            ->native(false)
                            ->helperText('Buit = correu no verificat encara.'),
                    ]),
                Forms\Components\Section::make('Seguretat')
                    ->columns(2)
                    ->schema([
                        Forms\Components\TextInput::make('password')
                            ->label('Contrasenya')
                            ->password()
                            ->revealable()
                            ->maxLength(255)
                            ->dehydrateStateUsing(fn (string $state): string => Hash::make($state))
                            ->dehydrated(fn (?string $state): bool => filled($state))
                            ->required(fn (string $operation): bool => $operation === 'create')
                            ->helperText(fn (string $operation) => $operation === 'edit' ? 'Deixa-ho en blanc per no canviar-la.' : null),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('ID')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('name')
                    ->label('Nom')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('email')
                    ->label('Correu')
                    ->searchable()
                    ->sortable()
                    ->copyable(),
                Tables\Columns\TextColumn::make('roles.role')
                    ->label('Rols')
                    ->badge()
                    ->separator(',')
                    ->colors([
                        'success' => 'seller',
                        'info' => 'investor',
                        'warning' => 'restaurant',
                    ])
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'seller' => 'Celler',
                        'investor' => 'Inversor',
                        'restaurant' => 'Restaurant',
                        default => $state,
                    }),
                Tables\Columns\IconColumn::make('email_verified_at')
                    ->label('Verificat')
                    ->boolean()
                    ->getStateUsing(fn (User $record): bool => $record->email_verified_at !== null),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Registrat')
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
                Tables\Filters\TernaryFilter::make('email_verified_at')
                    ->label('Correu verificat')
                    ->nullable()
                    ->placeholder('Tots')
                    ->trueLabel('Verificats')
                    ->falseLabel('Pendents de verificar'),
                Tables\Filters\SelectFilter::make('roles')
                    ->label('Rol')
                    ->relationship('roles', 'role')
                    ->options([
                        'seller' => 'Celler',
                        'investor' => 'Inversor',
                        'restaurant' => 'Restaurant',
                    ]),
            ])
            ->actions([
                Tables\Actions\Action::make('verify')
                    ->label('Verificar')
                    ->icon('heroicon-o-check-badge')
                    ->color('success')
                    ->visible(fn (User $record) => $record->email_verified_at === null)
                    ->requiresConfirmation()
                    ->action(fn (User $record) => $record->forceFill(['email_verified_at' => now()])->save()),
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
            RelationManagers\RolesRelationManager::class,
            RelationManagers\ProductsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['name', 'email'];
    }

    public static function getGlobalSearchResultDetails(\Illuminate\Database\Eloquent\Model $record): array
    {
        return ['Correu' => $record->email];
    }

    public static function getNavigationBadge(): ?string
    {
        return (string) User::visibleToAdmins()->count();
    }

    public static function getEloquentQuery(): Builder
    {
        // Oculta els comptes de User::HIDDEN_EMAILS: no apareixen a la
        // taula, a la cerca global, ni es poden obrir per edició/visualització
        // encara que algú es sàpiga la URL directa.
        return parent::getEloquentQuery()->visibleToAdmins();
    }
}
