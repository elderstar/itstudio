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
        $mail = (new MailMessage)
            ->subject('Новая заявка: '.$this->lead->name)
            ->greeting('Новая заявка с сайта')
            ->line('Имя: '.$this->lead->name)
            ->line('Email: '.($this->lead->email ?: '—'))
            ->line('Телефон: '.($this->lead->phone ?: '—'))
            ->line('Намерение: '.$this->lead->intentLabel())
            ->line('Сообщение:')
            ->line($this->lead->message);

        $intake = $this->lead->intake ?? [];

        if (! empty($intake['step2_chips'])) {
            $mail->line('Шаг 2: '.implode(', ', $intake['step2_chips']));
        }
        if (! empty($intake['step2_note'])) {
            $mail->line('Шаг 2 (текст): '.$intake['step2_note']);
        }
        if (! empty($intake['step3_chips'])) {
            $mail->line('Шаг 3: '.implode(', ', $intake['step3_chips']));
        }
        if (! empty($intake['step3_note'])) {
            $mail->line('Шаг 3 (текст): '.$intake['step3_note']);
        }

        return $mail;
    }
}
