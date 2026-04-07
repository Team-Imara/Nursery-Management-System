<?php

// app/Http/Controllers/MealPlanController.php (FR7.1-7.3, FR10.3)
namespace App\Http\Controllers;

use App\Models\MealPlan;
use Illuminate\Http\Request;

class MealPlanController extends Controller
{
    public function index()
    {
        // Fetch all meal plans for the current tenant (class-blind)
        // Ensure we are selecting the correct fields
        return response()->json(MealPlan::all());
    }

    public function store(Request $request)
    {
        // Log request data for debugging 422 errors
        \Illuminate\Support\Facades\Log::info('Meal Plan Storage Request:', $request->all());

        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'meals' => 'required|array',
            'meals.*.day' => 'required|string',
            'meals.*.meal_type' => 'required|string',
            'meals.*.meal_name' => 'required|string',
            'meals.*.status' => 'sometimes|nullable|string|in:healthy,review,allergy',
        ]);

        if ($validator->fails()) {
            \Illuminate\Support\Facades\Log::error('Meal Plan Validation Failed:', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validated = $validator->validated();

        try {
            // Transaction to ensure atomicity
            \Illuminate\Support\Facades\DB::beginTransaction();

            // Clear ALL existing plan for this tenant (switching to global/no class selection)
            // The BelongsToTenant trait automatically adds the tenant_id scope here.
            MealPlan::query()->delete();

            foreach ($validated['meals'] as $mealData) {
                MealPlan::create([
                    'day' => $mealData['day'],
                    'meal_type' => $mealData['meal_type'],
                    'meal_name' => $mealData['meal_name'],
                    'status' => $mealData['status'] ?? 'healthy',
                    'class_id' => null, // Global for all classes
                    'menu' => $mealData['meal_name'], 
                    'ingredients' => 'N/A',
                    'tenant_id' => auth()->user()->tenant_id,
                ]);
            }

            \Illuminate\Support\Facades\DB::commit();
            return response()->json(['message' => 'Meal plan updated successfully'], 201);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            return response()->json(['message' => 'Failed to update meal plan', 'error' => $e->getMessage()], 500);
        }
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