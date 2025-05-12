<?php

namespace App\Filament\Resources\RequestRestaurantResource\Pages;

use App\Filament\Resources\RequestRestaurantResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListRequestRestaurants extends ListRecords
{
    protected static string $resource = RequestRestaurantResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
