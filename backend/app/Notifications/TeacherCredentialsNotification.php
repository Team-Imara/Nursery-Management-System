<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class TeacherCredentialsNotification extends Notification implements ShouldQueue
{
    use Queueable;

    private $username;
    private $password;

    public function __construct($username, $password)
    {
        $this->username = $username;
        $this->password = $password;
    }

    public function via($notifiable)
    {
        return ['notify_lk'];
    }

    public function toNotifyLk($notifiable)
    {
        return new NotifyLkMessage(
            "Welcome! Your credentials are: Username: {$this->username}, Password: {$this->password}"
        );
    }
}
