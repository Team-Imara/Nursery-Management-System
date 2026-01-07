<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function index($studentId = null, $classId = null)
    {
        $query = Attendance::query();
        if ($studentId) $query->where('student_id', $studentId);
        if ($classId) $query->where('class_id', $classId);
        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'class_id' => 'required|exists:classes,id',
            'attendance_date' => 'required|date',
            'status' => 'required|in:present,absent,late',
            'notes' => 'nullable|string',
        ]);
        $validated['marked_by'] = auth()->id();
        $attendance = Attendance::create($validated);
        return response()->json($attendance, 201);
    }

    public function show($id)
    {
        $attendance = Attendance::findOrFail($id);
        return response()->json($attendance);
    }

    public function update(Request $request, $id)
    {
        $attendance = Attendance::findOrFail($id);
        $validated = $request->validate([
            'student_id' => 'sometimes|exists:students,id',
            'class_id' => 'sometimes|exists:classes,id',
            'attendance_date' => 'sometimes|date',
            'status' => 'sometimes|in:present,absent,late',
            'notes' => 'nullable|string',
        ]);
        $attendance->update($validated);
        return response()->json($attendance);
    }

    public function destroy($id)
    {
        $attendance = Attendance::findOrFail($id);
        $attendance->delete();
        return response()->json(null, 204);
    }
}