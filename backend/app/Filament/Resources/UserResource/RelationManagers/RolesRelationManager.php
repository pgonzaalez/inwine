<?php

namespace App\Filament\Resources\UserResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class RolesRelationManager extends RelationManager
{
    protected static string $relationship = 'roles';

    protected static ?string $title = 'Rols';

    protected static ?string $modelLabel = 'rol';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('role')
                    ->label('Rol')
                    ->options([
                        'seller' => 'Celler',
                        'investor' => 'Inversor',
                        'restaurant' => 'Restaurant',
                    ])
                    ->required(),
                Forms\Components\Toggle::make('is_active')
                    ->label('Actiu')
                    ->helperText('Rol actualment seleccionat per l\'usuari a l\'app.'),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('role')
            ->columns([
                Tables\Columns\TextColumn::make('role')
                    ->label('Rol')
                    ->badge()
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
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Actiu')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Creat')
                    ->dateTime('d/m/Y H:i'),
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
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
}
