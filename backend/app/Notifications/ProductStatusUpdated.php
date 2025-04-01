<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ProductStatusUpdated extends Notification
{
    use Queueable;

    protected $product;
    protected $status;

    public function __construct($product, $status)
    {
        $this->product = $product;
        $this->status = $status;
    }

    public function via($notifiable)
    {
        return ['database']; // Si es una notificación en la base de datos
    }

    public function toDatabase($notifiable)
    {
        return [
            'product_id' => $this->product->id,
            'status' => $this->status,
            'message' => "El estado del producto ha cambiado a {$this->status}.",
        ];
    }
}
