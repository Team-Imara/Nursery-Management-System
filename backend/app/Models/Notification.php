<?php

// app/Models/Notification.php (Optional; extends Laravel's DatabaseNotification for custom logic)
namespace App\Models;

use Illuminate\Notifications\DatabaseNotification;

class Notification extends DatabaseNotification
{
    // Custom scopes or methods if needed, e.g., for tenancy
    public function scopeForTenant($query, $tenantId)
    {
        return $query->where('tenant_id', $tenantId);
    }
}