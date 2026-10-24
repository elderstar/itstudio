<?php

namespace App\Notifications;

use App\Models\Lead;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewLeadNotification extends Notification
{
    use Queueable;

    public function __construct(public Lead $lead) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Новая заявка: '.$this->lead->name)
            ->greeting('Новая заявка с сайта')
            ->line('Имя: '.$this->lead->name)
            ->line('Email: '.$this->lead->email)
            ->line('Телефон: '.($this->lead->phone ?: '—'))
            ->line('Сообщение:')
            ->line($this->lead->message);
    }
}
