<?php

namespace App\Models;

use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;
use Stancl\Tenancy\Contracts\TenantWithDatabase;
use Stancl\Tenancy\Database\Concerns\HasDatabase;
use Stancl\Tenancy\Database\Concerns\HasDomains;

class Tenant extends BaseTenant implements TenantWithDatabase
{
    use HasDatabase, HasDomains;

    public static function getCustomColumns(): array
    {
        return [
            'id',
            'data',
            'nursery_name',
            'nursery_logo',
            'nursery_address',
            'nursery_contact',
            'nursery_email',
        ];
    }
    protected $appends = ['logo_url'];

    public function getLogoUrlAttribute()
    {
        if (!$this->nursery_logo) return null;
        if (str_starts_with($this->nursery_logo, 'http')) return $this->nursery_logo;
        return \Illuminate\Support\Facades\Storage::disk('public')->url($this->nursery_logo);
    }
}