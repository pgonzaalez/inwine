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
        // La notificació al tauler (database) sempre s'envia; el correu és
        // opcional i respecta la preferència de l'usuari a Configuració.
        $channels = ['database'];

        if ($notifiable->notify_by_email ?? true) {
            $channels[] = 'mail';
        }

        return $channels;
    }

    public function toDatabase($notifiable)
    {
        return [
            'product_id' => $this->product->id,
            'status' => $this->status,
            'message' => "El estado del producto ha cambiado a {$this->status}.",
        ];
    }

    public function toMail($notifiable): MailMessage
    {
        $productName = $this->product->name ?? "producte #{$this->product->id}";

        return (new MailMessage)
            ->subject("Novetat en el teu producte — {$productName}")
            ->greeting("Hola {$notifiable->name},")
            ->line("L'estat de \"{$productName}\" ha canviat a: **{$this->status}**.")
            ->line('Pots consultar tots els detalls des del teu tauler a INWine.')
            ->salutation('Gràcies per confiar en INWine.');
    }
}
