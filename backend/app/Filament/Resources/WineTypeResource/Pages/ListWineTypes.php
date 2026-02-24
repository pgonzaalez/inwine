<?php

namespace App\Filament\Resources\WineTypeResource\Pages;

use App\Filament\Resources\WineTypeResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListWineTypes extends ListRecords
{
    protected static string $resource = WineTypeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
