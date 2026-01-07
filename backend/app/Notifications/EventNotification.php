<?php

// app/Notifications/EventNotification.php (FR5.1, FR8.3-8.4)
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EventNotification extends Notification implements ShouldQueue
{
    use Queueable;

    private $event;

    public function __construct($event)
    {
        $this->event = $event;
    }

    public function via($notifiable)
    {
        return ['mail', 'notify_lk', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Upcoming Event: ' . $this->event->title)
            ->line('Description: ' . $this->event->description)
            ->line('Date: ' . $this->event->date)
            ->line('Time: ' . $this->event->time ?? 'N/A')
            ->line('Venue: ' . $this->event->venue ?? 'N/A')
            ->action('View Details', url('/events/' . $this->event->id)); // Adjust URL
    }

    public function toNotifyLk($notifiable)
    {
        return new NotifyLkMessage(
            'Event Alert: ' . $this->event->title . ' on ' . $this->event->date . '. Details: ' . $this->event->description
        );
    }

    public function toArray($notifiable)
    {
        return [
            'event_id' => $this->event->id,
            'title' => $this->event->title,
            'date' => $this->event->date,
        ];
    }
}