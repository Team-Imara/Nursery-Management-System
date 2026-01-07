<?php

// app/Models/MealPlan.php
namespace App\Models;

class MealPlan extends BaseTenantModel
{
    protected $fillable = [
        'class_id', 'day', 'meal_type', 'menu', 'ingredients', 'is_suitable_prediction', 'prediction_notes', 'tenant_id'
    ];

    public function classe()
    {
        return $this->belongsTo(Classes::class);
    }

    public function studentMeals()
    {
        return $this->hasMany(StudentMeal::class, 'meal_plan_id');
    }
}