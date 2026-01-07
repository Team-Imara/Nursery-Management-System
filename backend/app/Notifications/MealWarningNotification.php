<?php

// app/Notifications/MealWarningNotification.php (FR7.2-7.3)
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MealWarningNotification extends Notification implements ShouldQueue
{
    use Queueable;

    private $studentMeal;

    public function __construct($studentMeal)
    {
        $this->studentMeal = $studentMeal;
    }

    public function via($notifiable)
    {
        return ['mail', 'notify_lk'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Meal Warning for Your Child')
            ->line('The planned meal on ' . $this->studentMeal->date . ' may not be suitable due to allergies.')
            ->line('Menu: ' . $this->studentMeal->mealPlan->menu)
            ->line('Please contact the nursery for more details.');
    }

    public function toNotifyLk($notifiable)
    {
        return new NotifyLkMessage(
            'Meal Warning: Planned meal on ' . $this->studentMeal->date . ' unsuitable due to allergies. Contact nursery.'
        );
    }
}