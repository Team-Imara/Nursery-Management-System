<?php

// app/Models/Event.php
namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends BaseTenantModel
{
    use SoftDeletes;

    protected $fillable = [
        'title', 'description', 'date', 'time', 'venue', 'type', 'tenant_id'
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'time' => 'datetime:H:i',
        ];
    }
}