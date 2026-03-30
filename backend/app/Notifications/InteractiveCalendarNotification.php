<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use App\Channels\NotifyLkChannel;

class InteractiveCalendarNotification extends Notification implements ShouldQueue
{
    use Queueable;

    private $event;

    public function __construct($event)
    {
        $this->event = $event;
    }

    public function via($notifiable)
    {
        return [NotifyLkChannel::class];
    }

    public function toNotifyLk($notifiable)
    {
        $eventType = ucwords(str_replace('_', ' ', $this->event->type));
        $content = "Important {$eventType}: {$this->event->title} on {$this->event->date}. ";
        if ($this->event->time) {
            $content .= "Time: {$this->event->time}. ";
        }
        if ($this->event->venue) {
            $content .= "Venue: {$this->event->venue}. ";
        }
        if ($this->event->description) {
            // keep it short for SMS
            $content .= substr($this->event->description, 0, 50) . '...';
        }

        return new NotifyLkMessage($content);
    }
}
