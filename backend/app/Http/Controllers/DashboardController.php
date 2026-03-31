<?php

namespace App\Http\Controllers;

use App\Models\Classes;
use App\Models\Student;
use App\Models\User;
use App\Models\InteractiveCalendarEvent;
use App\Models\Attendance;
use App\Models\SkillRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today()->toDateString();
        
        // 1. Basic Stats
        $totalStudents = Student::count();
        $totalTeachers = User::where('role', 'teacher')->count();
        
        $startOfThisWeek = Carbon::now()->startOfWeek()->toDateString();
        $newStudentsThisWeek = Student::where('created_at', '>=', $startOfThisWeek)->count();
        
        // 2. Gender Distribution
        $maleStudents = Student::where('gender', 'male')->count();
        $femaleStudents = Student::where('gender', 'female')->count();
        
        // 3. Upcoming Events
        $upcomingEvents = InteractiveCalendarEvent::where('date', '>=', $today)
            ->orderBy('date', 'asc')
            ->limit(5)
            ->get();
            
        // 4. Section-aware Class Summary
        $classes = Classes::all();
        $classSummary = [];
        
        foreach ($classes as $classe) {
            $sections = is_array($classe->sections) ? $classe->sections : [];
            if (empty($sections)) $sections = [null];

            foreach ($sections as $section) {
                $query = Student::where('class_id', $classe->id);
                if ($section) {
                    $query->where('section', $section);
                }
                
                $studentsCount = $query->count();
                
                $teachersCount = DB::table('class_teacher')->where('class_id', $classe->id)->count();
                if ($classe->head_teacher_id) $teachersCount++;
                if ($classe->class_incharge_id && $classe->class_incharge_id !== $classe->head_teacher_id) $teachersCount++;

                // Attendance Today for this section
                $attendanceCount = Attendance::where('class_id', $classe->id)
                    ->where('attendance_date', $today)
                    ->whereHas('student', function($q) use ($section) {
                        if ($section) $q->where('section', $section);
                    })
                    ->whereIn('status', ['present', 'late', 'p', 'attended'])
                    ->count();

                $classSummary[] = [
                    'id' => $classe->id . ($section ? "-$section" : ""),
                    'class_id' => $classe->id,
                    'classname' => $classe->classname,
                    'section' => $section,
                    'students_count' => $studentsCount,
                    'teachers_count' => $teachersCount,
                    'attendance_percentage' => $studentsCount > 0 ? round(($attendanceCount / $studentsCount) * 100) : 0
                ];
            }
        }

        return response()->json([
            'stats' => [
                'total_students' => $totalStudents,
                'total_teachers' => $totalTeachers,
                'new_students_this_week' => $newStudentsThisWeek
            ],
            'gender_distribution' => [
                'male' => $maleStudents,
                'female' => $femaleStudents
            ],
            'upcoming_events' => $upcomingEvents,
            'performance_trends' => $this->getMonthlyPerformanceData(),
            'class_summary' => $classSummary
        ]);
    }

    private function getMonthlyPerformanceData()
    {
        $currentYear = Carbon::now()->year;
        $months = [];
        for ($m = 1; $m <= 12; $m++) {
            $months[] = Carbon::createFromDate($currentYear, $m, 1)->format('Y-m');
        }

        $classes = Classes::all();
        $sectionPerformance = [];

        foreach ($classes as $classe) {
            $sections = is_array($classe->sections) ? $classe->sections : [];
            if (empty($sections)) $sections = [null];

            foreach ($sections as $section) {
                $monthlyValues = [];
                foreach ($months as $month) {
                    $query = SkillRecord::where('class_id', $classe->id)
                        ->where('month', $month);
                    
                    if ($section) {
                        $query->whereHas('student', function($q) use ($section) {
                            $q->where('section', $section);
                        });
                    }

                    $avg = $query->avg('percentage');
                    $monthlyValues[] = $avg ? round($avg, 1) : 0;
                }

                $sectionPerformance[] = [
                    'label' => $classe->classname . ($section ? " - $section" : ""),
                    'data' => $monthlyValues,
                    'months' => array_map(function($m) { 
                        return Carbon::parse($m . '-01')->format('M'); 
                    }, $months)
                ];
            }
        }

        return $sectionPerformance;
    }
}
