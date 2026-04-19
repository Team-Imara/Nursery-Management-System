<?php

// app/Http/Controllers/TeacherAttendanceController.php (FR10.5)
namespace App\Http\Controllers;

use App\Models\TeacherAttendance;
use App\Models\User;
use Illuminate\Http\Request;
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

    public function bulkStore(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'attendances' => 'required|array',
            'attendances.*.teacher_id' => 'required|exists:users,id',
            'attendances.*.status' => 'required|in:present,absent,late'
        ]);

        foreach ($request->attendances as $record) {
            TeacherAttendance::updateOrCreate(
                [
                    'teacher_id' => $record['teacher_id'],
                    'date' => $request->date,
                    'tenant_id' => tenant('id')
                ],
                [
                    'status' => $record['status'],
                    'notes' => $record['notes'] ?? null,
                ]
            );
        }

        return response()->json(['message' => 'Attendance saved successfully']);
    }

    public function getWeeklySummary(Request $request)
    {
        $start = clone now()->startOfWeek();
        $end = clone now()->endOfWeek();

        $teachers = User::where('role', 'teacher')->get();
        $summary = [];

        $period = new \DatePeriod(
            $start,
            new \DateInterval('P1D'),
            (clone $end)->modify('+1 day')
        );

        $dates = [];
        foreach ($period as $date) {
            $dates[] = $date->format('Y-m-d');
        }

        foreach ($teachers as $teacher) {
            $days = [];
            foreach ($dates as $date) {
                if ($date > now()->format('Y-m-d')) {
                    $percentage = "-";
                } else {
                    $attendance = TeacherAttendance::where('teacher_id', $teacher->id)
                        ->where('date', $date)
                        ->first();
                    
                    if (!$attendance) {
                        $percentage = "-";
                    } else if (in_array($attendance->status, ['present', 'late'])) {
                        $percentage = "100%";
                    } else if ($attendance->status === 'absent') {
                        $percentage = "0%";
                    } else {
                        $percentage = "-";
                    }
                }

                $days[] = [
                    'day' => date('D', strtotime($date)),
                    'percentage' => $percentage
                ];
            }

            $summary[] = [
                'name' => $teacher->fullname,
                'days' => $days
            ];
        }

        return response()->json($summary);
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