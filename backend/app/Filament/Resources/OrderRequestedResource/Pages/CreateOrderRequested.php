<?php

namespace App\Filament\Resources\OrderRequestedResource\Pages;

use App\Filament\Resources\OrderRequestedResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateOrderRequested extends CreateRecord
{
    protected static string $resource = OrderRequestedResource::class;
}
