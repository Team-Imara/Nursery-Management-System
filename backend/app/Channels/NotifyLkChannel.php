<?php


// app/Channels/NotifyLkChannel.php (Custom channel for SMS via Notify.lk)
namespace App\Channels;

use Illuminate\Notifications\Notification;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

class NotifyLkChannel
{
    protected $client;

    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    public function send($notifiable, Notification $notification)
    {
        if (! method_exists($notification, 'toNotifyLk')) {
            return; // Skip if notification doesn't support NotifyLk
        }

        $message = $notification->toNotifyLk($notifiable);

        if (!$to = $notifiable->routeNotificationFor('notify_lk', $notification)) {
            return; // No phone
        }

        try {
            $response = $this->client->get('https://app.notify.lk/api/v1/send', [
                'query' => [
                    'user_id' => config('services.notify_lk.user_id'),
                    'api_key' => config('services.notify_lk.api_key'),
                    'sender_id' => config('services.notify_lk.sender_id'),
                    'to' => $to, // e.g., 9471XXXXXXX
                    'message' => $message->content,
                ],
            ]);

            if ($response->getStatusCode() !== 200) {
                // Log error: \Log::error('Notify.lk error: ' . $response->getBody());
            }
        } catch (RequestException $e) {
            // Log exception: \Log::error('Notify.lk exception: ' . $e->getMessage());
        }
    }
}