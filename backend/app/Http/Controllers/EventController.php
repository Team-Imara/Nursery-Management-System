<?php

// app/Http/Controllers/EventController.php (FR6, FR8)
namespace App\Http\Controllers;

use App\Models\Event;
use App\Notifications\EventNotification;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification; // For bulk/anonymous sends

class EventController extends Controller
{
    public function index()
    {
        return response()->json(Event::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date',
            'time' => 'nullable|date_format:H:i',
            'venue' => 'nullable|string',
            'type' => 'required|in:parent_meeting,cultural_program,concert,holiday,other',
        ]);
        $event = Event::create($validated);

        // Notify teachers (email + SMS)
        $teachers = User::where('role', 'teacher')->get();
        Notification::send($teachers, new EventNotification($event)); // Bulk to all teachers

        // Notify parents (SMS/email via contacts)
        $parentContacts = Student::pluck('mother_contact')
            ->merge(Student::pluck('father_contact'))
            ->merge(Student::pluck('guardian_contact'))
            ->filter()
            ->unique();

        foreach ($parentContacts as $contact) {
            if (filter_var($contact, FILTER_VALIDATE_EMAIL)) {
                Notification::route('mail', $contact)->notify(new EventNotification($event));
            } elseif (preg_match('/^947[0-9]{8}$/', $contact)) { // Adjust regex for your phone formats
                Notification::route('notify_lk', $contact)->notify(new EventNotification($event));
            }
        }

        return response()->json($event, 201);
    }

    public function show($id)
    {
        return response()->json(Event::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'date' => 'sometimes|date',
            'time' => 'nullable|date_format:H:i',
            'venue' => 'nullable|string',
            'type' => 'sometimes|in:parent_meeting,cultural_program,concert,holiday,other',
        ]);
        $event->update($validated);

        // Optional: Re-notify on update if significant changes (e.g., date change)
        // Reuse the same teacher/parent logic as in store() if needed
        // e.g., Notification::send($teachers, new EventNotification($event));

        return response()->json($event);
    }

    public function destroy($id)
    {
        Event::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}