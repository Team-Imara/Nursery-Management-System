<?php

// app/Models/TeacherAttendance.php
namespace App\Models;

class TeacherAttendance extends BaseTenantModel
{
    protected $fillable = [
        'teacher_id', 'date', 'status', 'notes', 'tenant_id'
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
        ];
    }

    public function teacher()
    {
        return $this->belongsTo(User::class);
    }
}