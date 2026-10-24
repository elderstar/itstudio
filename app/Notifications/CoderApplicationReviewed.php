<?php

namespace App\Notifications;

use App\Models\CoderApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CoderApplicationReviewed extends Notification
{
    use Queueable;

    public function __construct(public CoderApplication $application) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $approved = $this->application->status->value === 'approved';

        return (new MailMessage)
            ->subject($approved ? 'Анкета кодера одобрена' : 'Анкета кодера отклонена')
            ->line($approved
                ? 'Ваша анкета одобрена. Теперь доступна лента заказов.'
                : 'Ваша анкета отклонена. Свяжитесь с администратором при необходимости.')
            ->action('Открыть кабинет', url('/dashboard'));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'coder_application_reviewed',
            'status' => $this->application->status->value,
            'application_id' => $this->application->id,
        ];
    }
}
