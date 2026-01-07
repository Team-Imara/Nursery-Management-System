<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

abstract class BaseTenantModel extends Model {
    use BelongsToTenant;
}