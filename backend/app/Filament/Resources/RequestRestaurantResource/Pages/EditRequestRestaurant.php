<?php

namespace App\Filament\Resources\RequestRestaurantResource\Pages;

use App\Filament\Resources\RequestRestaurantResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditRequestRestaurant extends EditRecord
{
    protected static string $resource = RequestRestaurantResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
