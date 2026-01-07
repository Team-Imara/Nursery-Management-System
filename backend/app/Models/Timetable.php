<?php

namespace App\Models;

class Timetable extends BaseTenantModel
{
    protected $fillable = [
        'class_id', 'day', 'time_slot', 'activity', 'tenant_id'
    ];

    public function classe()
    {
        return $this->belongsTo(Classes::class);
    }
}