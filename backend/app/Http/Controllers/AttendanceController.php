<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Student;
use App\Models\Classes;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $query = Attendance::with(['student', 'classe']);
        if ($request->has('student_id')) $query->where('student_id', $request->student_id);
        if ($request->has('class_id')) $query->where('class_id', $request->class_id);
        if ($request->has('date')) $query->where('attendance_date', $request->date);
        return response()->json($query->get());
    }

    public function getStudentsForAttendance(Request $request)
    {
        $request->validate([
            'class_id' => 'required|exists:classes,id',
            'attendance_date' => 'required|date',
            'section' => 'nullable|string'
        ]);

        $students = Student::where('class_id', $request->class_id);
        if ($request->has('section')) {
            $students->where('section', $request->section);
        }
        $students = $students->get();

        $existingAttendance = Attendance::where('class_id', $request->class_id)
            ->where('attendance_date', $request->attendance_date)
            ->get()
            ->keyBy('student_id');

        $data = $students->map(function($student) use ($existingAttendance) {
            return [
                'id' => $student->id,
                'fullname' => $student->fullname,
                'status' => $existingAttendance->get($student->id)->status ?? null,
                'notes' => $existingAttendance->get($student->id)->notes ?? null,
                'attendance_id' => $existingAttendance->get($student->id)->id ?? null,
            ];
        });

        return response()->json($data);
    }

    public function bulkStore(Request $request)
    {
        $request->validate([
            'class_id' => 'required|exists:classes,id',
            'attendance_date' => 'required|date',
            'attendances' => 'required|array',
            'attendances.*.student_id' => 'required|exists:students,id',
            'attendances.*.status' => 'required|in:present,absent,late'
        ]);

        foreach ($request->attendances as $record) {
            Attendance::updateOrCreate(
                [
                    'student_id' => $record['student_id'],
                    'attendance_date' => $request->attendance_date,
                    'tenant_id' => tenant('id')
                ],
                [
                    'class_id' => $request->class_id,
                    'status' => $record['status'],
                    'notes' => $record['notes'] ?? null,
                    'marked_by' => auth()->id()
                ]
            );
        }

        return response()->json(['message' => 'Attendance saved successfully']);
    }

    public function getWeeklySummary(Request $request)
    {
        // Get start and end of week (or provided range)
        $start = $request->start ?? now()->startOfWeek()->toDateString();
        $end = $request->end ?? now()->endOfWeek()->toDateString();

        $classes = Classes::all();
        $summary = [];

        // Generate date range
        $period = new \DatePeriod(
            new \DateTime($start),
            new \DateInterval('P1D'),
            (new \DateTime($end))->modify('+1 day')
        );

        $dates = [];
        foreach ($period as $date) {
            $dates[] = $date->format('Y-m-d');
        }

        foreach ($classes as $classe) {
            $classSections = is_array($classe->sections) && count($classe->sections) > 0 
                ? $classe->sections 
                : [null];
            
            foreach ($classSections as $section) {
                $section = $section ? trim((string)$section) : null;
                $days = [];
                foreach ($dates as $date) {
                    $studentQuery = Student::withoutGlobalScopes()->where('class_id', $classe->id);
                    if ($section) {
                        $studentQuery->where('section', $section);
                    }
                    $totalStudents = $studentQuery->count();

                    if ($totalStudents === 0) {
                        $percentage = "-";
                    } else {
                        $attendanceQuery = Attendance::where('class_id', $classe->id)
                            ->where('attendance_date', $date)
                            ->whereIn('status', ['present', 'late']);
                        
                        if ($section) {
                            $attendanceQuery->whereHas('student', function($q) use ($section) {
                                $q->where('section', $section);
                            });
                        }
                        
                        $presentCount = $attendanceQuery->count();
                        $percentage = round(($presentCount / $totalStudents) * 100) . "%";
                    }

                    $days[] = [
                        'day' => date('D', strtotime($date)),
                        'date' => date('d M', strtotime($date)),
                        'full_date' => $date,
                        'percentage' => $percentage
                    ];
                }

                $summary[] = [
                    'id' => $classe->id,
                    'className' => $classe->classname,
                    'sections' => $section ?: 'No Section',
                    'days' => $days
                ];
            }
        }

        return response()->json($summary);
    }

    public function getOverallSummary(Request $request)
    {
        $totalStudents = Student::count();
        $maleStudents = Student::where('gender', 'male')->count();
        $femaleStudents = Student::where('gender', 'female')->count();

        // Calculate Last Week's Stats (Previous complete week Mon to Sun)
        $startOfLastWeek = now()->subWeek()->startOfWeek()->toDateString();
        $endOfLastWeek = now()->subWeek()->endOfWeek()->toDateString();
        
        // Also calculate monthly for reference if needed, but last_week_avg is what's requested
        return response()->json([
            'total' => $totalStudents,
            'male_students' => $maleStudents,
            'female_students' => $femaleStudents,
            'last_week_avg' => $this->calculateAvgAttendance($startOfLastWeek, $endOfLastWeek)
        ]);
    }

    public function getManagementSummary(Request $request)
    {
        $today = now()->toDateString();
        $startOfWeek = now()->startOfWeek()->toDateString();
        $startOfMonth = now()->startOfMonth()->toDateString();
        
        $totalStudents = Student::count();

        $presentToday = Attendance::where('attendance_date', $today)
            ->whereIn('status', ['present', 'late'])
            ->count();

        $absentToday = Attendance::where('attendance_date', $today)
            ->where('status', 'absent')
            ->count();
            
        $todayPercentage = $totalStudents > 0 ? round(($presentToday / $totalStudents) * 100) . "%" : "0%";

        return response()->json([
            'present_today' => $presentToday,
            'absent_today' => $absentToday,
            'today_percentage' => $todayPercentage,
            'weekly_avg' => $this->calculateAvgAttendance($startOfWeek, $today),
            'monthly_avg' => $this->calculateAvgAttendance($startOfMonth, $today)
        ]);
    }

    private function calculateAvgAttendance($start, $end)
    {
        $totalStudents = Student::count();
        if ($totalStudents === 0) return "0%";

        $days = Attendance::whereBetween('attendance_date', [$start, $end])
            ->select('attendance_date')
            ->distinct()
            ->get()
            ->count();

        if ($days === 0) return "0%";

        $presentCount = Attendance::whereBetween('attendance_date', [$start, $end])
            ->whereIn('status', ['present', 'late'])
            ->count();

        $avg = ($presentCount / ($totalStudents * $days)) * 100;
        return round($avg) . "%";
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