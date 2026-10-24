<?php

namespace App\Notifications;

use App\Models\Message;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewOrderMessage extends Notification
{
    use Queueable;

    public function __construct(public Message $message) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Новое сообщение в заказе')
            ->line($this->message->user->name.': '.$this->message->body)
            ->action('Открыть чат', url('/cabinet/orders/'.$this->message->order_id.'/chat'));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'new_order_message',
            'order_id' => $this->message->order_id,
            'message_id' => $this->message->id,
            'preview' => str($this->message->body)->limit(120)->toString(),
            'user_name' => $this->message->user->name,
        ];
    }
}
