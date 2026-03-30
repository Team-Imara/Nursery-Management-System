<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InteractiveCalendarEvent extends BaseTenantModel
{
    protected $fillable = [
        'tenant_id',
        'title',
        'date',
        'time',
        'description',
        'venue',
        'type',
        'audience',
    ];
}
