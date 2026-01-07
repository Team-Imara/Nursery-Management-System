<?php

// app/Http/Controllers/ObservationController.php (FR1.3-1.4, FR2.1-2.3)
namespace App\Http\Controllers;

use App\Models\Observation;
use Illuminate\Http\Request;

class ObservationController extends Controller
{
    public function index($studentId)
    {
        return response()->json(Observation::where('student_id', $studentId)->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'date' => 'required|date',
            'mood' => 'nullable|string',
            'social_interaction' => 'nullable|string',
            'attention_span' => 'nullable|string',
            'language_development' => 'nullable|string',
            'motor_skills' => 'nullable|string',
            'health_observation' => 'nullable|string',
            'teacher_comments' => 'nullable|string',
        ]);
        $observation = Observation::create($validated);
        return response()->json($observation, 201);
    }

    public function show($id)
    {
        $observation = Observation::findOrFail($id);
        return response()->json($observation);
    }

    public function update(Request $request, $id)
    {
        $observation = Observation::findOrFail($id);
        $validated = $request->validate([
            'student_id' => 'sometimes|exists:students,id',
            'date' => 'sometimes|date',
            'mood' => 'nullable|string',
            'social_interaction' => 'nullable|string',
            'attention_span' => 'nullable|string',
            'language_development' => 'nullable|string',
            'motor_skills' => 'nullable|string',
            'health_observation' => 'nullable|string',
            'teacher_comments' => 'nullable|string',
        ]);
        $observation->update($validated);
        return response()->json($observation);
    }

    public function destroy($id)
    {
        $observation = Observation::findOrFail($id);
        $observation->delete();
        return response()->json(null, 204);
    }
}