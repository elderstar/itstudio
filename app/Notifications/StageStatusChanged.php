<?php

namespace App\Notifications;

use App\Models\OrderStage;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class StageStatusChanged extends Notification
{
    use Queueable;

    public function __construct(public OrderStage $stage) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Обновлён этап заказа')
            ->line("Этап «{$this->stage->title}»: {$this->stage->status->label()}")
            ->action('Открыть этапы', url('/cabinet/orders/'.$this->stage->order_id.'/stages'));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'stage_status_changed',
            'order_id' => $this->stage->order_id,
            'stage_id' => $this->stage->id,
            'title' => $this->stage->title,
            'status' => $this->stage->status->value,
        ];
    }
}
