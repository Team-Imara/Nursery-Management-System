<?php

// app/Http/Controllers/TeacherAttendanceController.php (FR10.5)
namespace App\Http\Controllers;

use App\Models\TeacherAttendance;
use Illuminate\Http\Request;

class TeacherAttendanceController extends Controller
{
    public function index($teacherId = null)
    {
        $query = TeacherAttendance::query();
        if ($teacherId) $query->where('teacher_id', $teacherId);
        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'status' => 'required|in:present,absent,late',
            'notes' => 'nullable|string',
        ]);
        $teacherAttendance = TeacherAttendance::create($validated);
        return response()->json($teacherAttendance, 201);
    }

    public function show($id)
    {
        $teacherAttendance = TeacherAttendance::findOrFail($id);
        return response()->json($teacherAttendance);
    }

    public function update(Request $request, $id)
    {
        $teacherAttendance = TeacherAttendance::findOrFail($id);
        $validated = $request->validate([
            'teacher_id' => 'sometimes|exists:users,id',
            'date' => 'sometimes|date',
            'status' => 'sometimes|in:present,absent,late',
            'notes' => 'nullable|string',
        ]);
        $teacherAttendance->update($validated);
        return response()->json($teacherAttendance);
    }

    public function destroy($id)
    {
        $teacherAttendance = TeacherAttendance::findOrFail($id);
        $teacherAttendance->delete();
        return response()->json(null, 204);
    }
}