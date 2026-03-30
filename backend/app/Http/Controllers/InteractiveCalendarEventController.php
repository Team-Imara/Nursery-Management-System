<?php

namespace App\Http\Controllers;

use App\Models\InteractiveCalendarEvent;
use App\Models\Student;
use App\Notifications\InteractiveCalendarNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

class InteractiveCalendarEventController extends Controller
{
    /**
     * Display a listing of the events.
     */
    public function index(Request $request)
    {
        $events = InteractiveCalendarEvent::all();
        return response()->json($events);
    }

    /**
     * Store a newly created event in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'time' => 'nullable|string',
            'description' => 'nullable|string',
            'venue' => 'nullable|string|max:255',
            'type' => 'required|in:holiday,special',
            'audience' => 'required|string', // 'all' or class_id
        ]);

        $event = InteractiveCalendarEvent::create($validated);

        // Send SMS notifications
        if ($validated['audience'] === 'all') {
            $students = Student::all();
        } else {
            $students = Student::where('class_id', $validated['audience'])->get();
        }

        if ($students->isNotEmpty()) {
            Notification::send($students, new InteractiveCalendarNotification($event));
        }

        return response()->json([
            'message' => 'Event created successfully and notifications sent.',
            'event' => $event
        ], 201);
    }
}
