<?php

// app/Http/Controllers/ReportController.php (FR10 all)
namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Student;
use App\Models\Observation;
use App\Models\StudentMeal;
use App\Models\TeacherAttendance;
use App\Models\LeaveRequest;
use App\Models\Classes;
use App\Models\Event;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function progressReport(Request $request, $studentId)
    {
        $observations = Observation::where('student_id', $studentId)
            ->whereBetween('date', [$request->start, $request->end])->get();
        // Aggregate for performance prediction FR10.4
        $pdf = Pdf::loadView('reports.progress', ['observations' => $observations]);
        return $pdf->download('progress_report.pdf');
    }

    public function attendanceReport(Request $request)
    {
        $attendances = Attendance::whereBetween('attendance_date', [$request->start, $request->end])->get();
        $pdf = Pdf::loadView('reports.attendance', ['attendances' => $attendances]);
        return $pdf->download('attendance_report.pdf');
    }

    public function mealPlanningReport(Request $request)
    {
        $meals = StudentMeal::whereBetween('date', [$request->start, $request->end])->get();
        $pdf = Pdf::loadView('reports.meal_planning', ['meals' => $meals]);
        return $pdf->download('meal_planning_report.pdf');
    }

    public function performancePredictionReport(Request $request, $studentId)
    {
        // Logic: Average from observations
        $observations = Observation::where('student_id', $studentId)->get();
        // Compute averages
        $pdf = Pdf::loadView('reports.performance_prediction', ['observations' => $observations]);
        return $pdf->download('performance_prediction_report.pdf');
    }

    public function teacherAttendanceLeaveReport(Request $request)
    {
        $attendances = TeacherAttendance::whereBetween('date', [$request->start, $request->end])->get();
        $leaves = LeaveRequest::whereBetween('from_date', [$request->start, $request->end])->get();
        $pdf = Pdf::loadView('reports.teacher_attendance_leave', compact('attendances', 'leaves'));
        return $pdf->download('teacher_attendance_leave_report.pdf');
    }

    public function teacherClassAllocationReport()
    {
        $classes = Classes::with(['headTeacher', 'assistantTeachers'])->get();
        $pdf = Pdf::loadView('reports.teacher_class_allocation', ['classes' => $classes]);
        return $pdf->download('teacher_class_allocation_report.pdf');
    }

    public function studentTutorDetailsReport()
    {
        $students = Student::with('classe.headTeacher')->get();
        $pdf = Pdf::loadView('reports.student_tutor_details', ['students' => $students]);
        return $pdf->download('student_tutor_details_report.pdf');
    }

    public function eventSummaryReport(Request $request)
    {
        $events = Event::whereBetween('date', [$request->start, $request->end])->get();
        $pdf = Pdf::loadView('reports.event_summary', ['events' => $events]);
        return $pdf->download('event_summary_report.pdf');
    }

    public function classPerformanceSummary(Request $request, $classId)
    {
        $class = Classes::findOrFail($classId);
        $observations = Observation::whereIn('student_id', $class->students->pluck('id'))
            ->whereBetween('date', [$request->start, $request->end])->get();
        // Aggregates
        $pdf = Pdf::loadView('reports.class_performance_summary', compact('class', 'observations'));
        return $pdf->download('class_performance_summary_report.pdf');
    }
}