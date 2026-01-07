<?php 

// app/Models/Attendance.php
namespace App\Models;

class Attendance extends BaseTenantModel
{
    protected $fillable = [
        'student_id', 'class_id', 'attendance_date', 'status', 'marked_by', 'notes', 'tenant_id'
    ];

    protected function casts(): array
    {
        return [
            'attendance_date' => 'date',
        ];
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function classe()
    {
        return $this->belongsTo(Classes::class);
    }

    public function markedBy()
    {
        return $this->belongsTo(User::class, 'marked_by');
    }
}