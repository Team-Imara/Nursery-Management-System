<?php

// app/Http/Controllers/LeaveRequestController.php (FR4.2-4.3, FR10.5)
namespace App\Http\Controllers;

use App\Models\LeaveRequest;
use App\Notifications\LeaveApprovalNotification;
use Illuminate\Http\Request;

class LeaveRequestController extends Controller
{
    public function index()
    {
        return response()->json(LeaveRequest::with(['teacher', 'approver'])->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'from_date' => 'required|date',
            'to_date' => 'required|date|after_or_equal:from_date',
            'reason' => 'required|string',
        ]);
        $validated['teacher_id'] = auth()->id();
        $leave = LeaveRequest::create($validated);
        return response()->json($leave, 201);
    }

    public function approve(Request $request, $id)
    {
        $leave = LeaveRequest::findOrFail($id);
        $leave->update(['status' => 'approved', 'approved_by' => auth()->id()]);

        // Notify the teacher (email + SMS)
        $teacher = $leave->teacher;
        $teacher->notify(new LeaveApprovalNotification($leave)); // Add this line

        return response()->json($leave);
    }

    public function reject(Request $request, $id)
    {
        $leave = LeaveRequest::findOrFail($id);
        $leave->update(['status' => 'rejected', 'approved_by' => auth()->id()]);

        // Notify the teacher (email + SMS)
        $teacher = $leave->teacher;
        $teacher->notify(new LeaveApprovalNotification($leave)); // Add this line

        return response()->json($leave);
    }
}