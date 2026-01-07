<?php

// app/Models/LeaveRequest.php
namespace App\Models;

class LeaveRequest extends BaseTenantModel
{
    protected $fillable = [
        'teacher_id', 'from_date', 'to_date', 'reason', 'status', 'approved_by', 'tenant_id'
    ];

    protected function casts(): array
    {
        return [
            'from_date' => 'date',
            'to_date' => 'date',
        ];
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}