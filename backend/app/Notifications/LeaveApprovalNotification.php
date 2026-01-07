<?php

// app/Notifications/LeaveApprovalNotification.php (For leave updates)
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LeaveApprovalNotification extends Notification implements ShouldQueue
{
    use Queueable;

    private $leaveRequest;

    public function __construct($leaveRequest)
    {
        $this->leaveRequest = $leaveRequest;
    }

    public function via($notifiable)
    {
        return ['mail', 'notify_lk', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Leave Request Update')
            ->line('Your leave from ' . $this->leaveRequest->from_date . ' to ' . $this->leaveRequest->to_date . ' has been ' . $this->leaveRequest->status . '.')
            ->line('Reason: ' . $this->leaveRequest->reason);
    }

    public function toNotifyLk($notifiable)
    {
        return new NotifyLkMessage(
            'Leave Update: Your request (' . $this->leaveRequest->from_date . ' to ' . $this->leaveRequest->to_date . ') is ' . $this->leaveRequest->status . '.'
        );
    }

    public function toArray($notifiable)
    {
        return [
            'leave_id' => $this->leaveRequest->id,
            'status' => $this->leaveRequest->status,
        ];
    }
}