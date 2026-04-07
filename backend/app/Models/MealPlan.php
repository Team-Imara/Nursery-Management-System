<?php

// app/Models/MealPlan.php
namespace App\Models;

class MealPlan extends BaseTenantModel
{
    protected $fillable = [
        'class_id', 'day', 'meal_type', 'menu', 'ingredients', 'status', 'meal_name', 'tenant_id'
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