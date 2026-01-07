<?php

// app/Http/Controllers/StudentMealController.php (FR7.1-7.3)
namespace App\Http\Controllers;

use App\Models\StudentMeal;
use App\Models\MealPlan;
use App\Models\Student;
use App\Notifications\MealWarningNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

class StudentMealController extends Controller
{
    public function index($studentId = null, $classId = null)
    {
        $query = StudentMeal::query();
        if ($studentId) $query->where('student_id', $studentId);
        if ($classId) $query->where('class_id', $classId);
        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'meal_plan_id' => 'required|exists:meal_plans,id',
            'class_id' => 'required|exists:classes,id',
            'date' => 'required|date',
            'status' => 'nullable|string',
            'notes' => 'nullable|string',
            'suitable' => 'boolean',
        ]);
        $studentMeal = StudentMeal::create($validated);

        $student = Student::find($validated['student_id']);
        $mealPlan = MealPlan::find($validated['meal_plan_id']);

        if (stripos($mealPlan->ingredients, $student->allergies ?? '') !== false) {
            $studentMeal->update(['suitable' => false]);
            
            // Notify parent (email or SMS based on contact)
            $parentContact = $student->mother_contact ?? $student->father_contact ?? $student->guardian_contact;
            if ($parentContact) {
                if (filter_var($parentContact, FILTER_VALIDATE_EMAIL)) {
                    Notification::route('mail', $parentContact)->notify(new MealWarningNotification($studentMeal));
                } elseif (preg_match('/^947[0-9]{8}$/', $parentContact)) {
                    Notification::route('notify_lk', $parentContact)->notify(new MealWarningNotification($studentMeal));
                }
            }
        }

        return response()->json($studentMeal, 201);
    }

    public function show($id)
    {
        $studentMeal = StudentMeal::findOrFail($id);
        return response()->json($studentMeal);
    }

    public function update(Request $request, $id)
    {
        $studentMeal = StudentMeal::findOrFail($id);
        $validated = $request->validate([
            'student_id' => 'sometimes|exists:students,id',
            'meal_plan_id' => 'sometimes|exists:meal_plans,id',
            'class_id' => 'sometimes|exists:classes,id',
            'date' => 'sometimes|date',
            'status' => 'nullable|string',
            'notes' => 'nullable|string',
            'suitable' => 'sometimes|boolean',
        ]);
        $studentMeal->update($validated);
        return response()->json($studentMeal);
    }

    public function destroy($id)
    {
        $studentMeal = StudentMeal::findOrFail($id);
        $studentMeal->delete();
        return response()->json(null, 204);
    }
}