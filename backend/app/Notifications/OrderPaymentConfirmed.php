<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class OrderPaymentConfirmed extends Notification
{
    use Queueable;

    public function __construct(
        protected string $productName,
        protected int $quantity,
        protected float $unitPrice,
        protected float $totalPrice,
        protected int $orderReference,
    ) {
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Confirmació del teu pagament — comanda #{$this->orderReference}")
            ->greeting("Hola {$notifiable->name},")
            ->line('Hem rebut correctament el pagament de la teva comanda a INWINE.')
            ->line("**Producte:** {$this->productName}")
            ->line("**Quantitat:** {$this->quantity}")
            ->line('**Preu unitari:** ' . number_format($this->unitPrice, 2) . ' €')
            ->line('**Total pagat:** ' . number_format($this->totalPrice, 2) . ' €')
            ->line('El venedor ja ha estat notificat i preparant la teva comanda per enviar-la.')
            ->salutation('Gràcies per confiar en INWine.');
    }

    public function toDatabase($notifiable): array
    {
        return [
            'type' => 'order_payment_confirmed',
            'order_reference' => $this->orderReference,
            'product_name' => $this->productName,
            'quantity' => $this->quantity,
            'total_price' => $this->totalPrice,
            'message' => "Pagament confirmat per a la comanda #{$this->orderReference}.",
        ];
    }
}
