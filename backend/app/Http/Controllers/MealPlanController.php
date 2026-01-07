<?php

// app/Http/Controllers/MealPlanController.php (FR7.1-7.3, FR10.3)
namespace App\Http\Controllers;

use App\Models\MealPlan;
use Illuminate\Http\Request;

class MealPlanController extends Controller
{
    public function index($classId = null)
    {
        $query = MealPlan::query();
        if ($classId) $query->where('class_id', $classId);
        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'day' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'meal_type' => 'required|string|max:255',
            'menu' => 'required|string',
            'ingredients' => 'required|string',
        ]);
        $mealPlan = MealPlan::create($validated);
        return response()->json($mealPlan, 201);
    }

    public function show($id)
    {
        $mealPlan = MealPlan::findOrFail($id);
        return response()->json($mealPlan);
    }

    public function update(Request $request, $id)
    {
        $mealPlan = MealPlan::findOrFail($id);
        $validated = $request->validate([
            'class_id' => 'sometimes|exists:classes,id',
            'day' => 'sometimes|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'meal_type' => 'sometimes|string|max:255',
            'menu' => 'sometimes|string',
            'ingredients' => 'sometimes|string',
        ]);
        $mealPlan->update($validated);
        return response()->json($mealPlan);
    }

    public function destroy($id)
    {
        $mealPlan = MealPlan::findOrFail($id);
        $mealPlan->delete();
        return response()->json(null, 204);
    }
}