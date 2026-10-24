<?php

namespace App\Notifications;

use App\Models\OrderJoinRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class JoinRequestReviewed extends Notification
{
    use Queueable;

    public function __construct(public OrderJoinRequest $joinRequest) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $approved = $this->joinRequest->status->value === 'approved';
        $order = $this->joinRequest->order;

        return (new MailMessage)
            ->subject($approved ? 'Вас приняли в заказ' : 'Заявка в заказ отклонена')
            ->line($approved
                ? "Вас приняли в заказ «{$order->title}»."
                : "Заявка в заказ «{$order->title}» отклонена.")
            ->action('Открыть заказ', url('/cabinet/orders/'.$order->id));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'join_request_reviewed',
            'status' => $this->joinRequest->status->value,
            'order_id' => $this->joinRequest->order_id,
            'join_request_id' => $this->joinRequest->id,
        ];
    }
}
