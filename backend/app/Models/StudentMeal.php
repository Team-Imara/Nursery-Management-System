<?php

// app/Models/StudentMeal.php
namespace App\Models;

class StudentMeal extends BaseTenantModel
{
    protected $fillable = [
        'student_id', 'meal_plan_id', 'class_id', 'date', 'status', 'notes', 'suitable', 'tenant_id'
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'suitable' => 'boolean',
        ];
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function mealPlan()
    {
        return $this->belongsTo(MealPlan::class);
    }

    public function classe()
    {
        return $this->belongsTo(Classes::class);
    }
}