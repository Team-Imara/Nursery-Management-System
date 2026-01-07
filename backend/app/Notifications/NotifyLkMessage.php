<?php
// app/Notifications/NotifyLkMessage.php (Message builder for Notify.lk SMS)
namespace App\Notifications;

class NotifyLkMessage
{
    public $content;

    public function __construct($content)
    {
        $this->content = $content;
    }
}