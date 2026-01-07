<?php

// app/Http/Controllers/NotificationController.php (For managing notifications)
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\Notification as NotificationFacade;
use App\Models\User;
use App\Models\Student;
use App\Notifications\CustomNotification; // Add this import

class NotificationController extends Controller
{
    public function index()
    {
        return response()->json(auth()->user()->notifications);
    }

    public function unread()
    {
        return response()->json(auth()->user()->unreadNotifications);
    }

    public function markAsRead($id)
    {
        $notification = auth()->user()->notifications()->findOrFail($id);
        $notification->markAsRead();
        return response()->json($notification);
    }

    public function markAllAsRead()
    {
        auth()->user()->unreadNotifications->markAsRead();
        return response()->json(['message' => 'All notifications marked as read']);
    }

    public function sendCustom(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id', // Teacher
            'student_id' => 'nullable|exists:students,id', // Parent via student
            'message' => 'required|string',
        ]);

        if ($validated['user_id']) {
            $user = User::find($validated['user_id']);
            $user->notify(new CustomNotification($validated['message']));
        } elseif ($validated['student_id']) {
            $student = Student::find($validated['student_id']);
            $parentContact = $student->mother_contact ?? $student->father_contact ?? $student->guardian_contact;
            if ($parentContact) {
                if (filter_var($parentContact, FILTER_VALIDATE_EMAIL)) {
                    NotificationFacade::route('mail', $parentContact)->notify(new CustomNotification($validated['message']));
                } else {
                    NotificationFacade::route('notify_lk', $parentContact)->notify(new CustomNotification($validated['message']));
                }
            }
        }

        return response()->json(['message' => 'Notification sent'], 200);
    }
}