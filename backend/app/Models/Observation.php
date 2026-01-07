<?php

// app/Models/Observation.php
namespace App\Models;

class Observation extends BaseTenantModel
{
    protected $fillable = [
        'student_id', 'date', 'mood', 'social_interaction', 'attention_span',
        'language_development', 'motor_skills', 'health_observation', 'teacher_comments', 'tenant_id'
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
        ];
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}