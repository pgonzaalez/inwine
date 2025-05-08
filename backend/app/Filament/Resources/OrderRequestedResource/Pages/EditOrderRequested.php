<?php

namespace App\Filament\Resources\OrderRequestedResource\Pages;

use App\Filament\Resources\OrderRequestedResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditOrderRequested extends EditRecord
{
    protected static string $resource = OrderRequestedResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
