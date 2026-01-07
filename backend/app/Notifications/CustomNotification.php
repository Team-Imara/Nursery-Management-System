<?php

// app/Notifications/CustomNotification.php (For ad-hoc messages)
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CustomNotification extends Notification implements ShouldQueue
{
    use Queueable;

    private $message;

    public function __construct($message)
    {
        $this->message = $message;
    }

    public function via($notifiable)
    {
        return ['mail', 'notify_lk', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Nursery Notification')
            ->line($this->message);
    }

    public function toNotifyLk($notifiable)
    {
        return new NotifyLkMessage($this->message);
    }

    public function toArray($notifiable)
    {
        return [
            'message' => $this->message,
        ];
    }
}