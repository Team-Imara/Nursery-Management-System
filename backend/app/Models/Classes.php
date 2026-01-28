<?php

// app/Models/Classes.php
namespace App\Models;

class Classes extends BaseTenantModel
{
    protected $fillable = [
        'classname', 'capacity', 'total_students', 'head_teacher_id', 'class_incharge_id', 'sections', 'tenant_id'
    ];

    protected $casts = [
        'sections' => 'array',
    ];

    public function headTeacher()
    {
        return $this->belongsTo(User::class, 'head_teacher_id');
    }

    public function classIncharge()
    {
        return $this->belongsTo(User::class, 'class_incharge_id');
    }

    public function assistantTeachers()
    {
        return $this->belongsToMany(User::class, 'class_teacher', 'class_id', 'teacher_id');
    }

    public function students()
    {
        return $this->hasMany(Student::class, 'class_id');
    }

    public function timetables()
    {
        return $this->hasMany(Timetable::class, 'class_id');
    }

    public function mealPlans()
    {
        return $this->hasMany(MealPlan::class, 'class_id');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'class_id');
    }

    public function studentMeals()
    {
        return $this->hasMany(StudentMeal::class, 'class_id');
    }
}