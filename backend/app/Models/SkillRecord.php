<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SkillRecord extends BaseTenantModel
{
    protected $fillable = ['student_id', 'class_id', 'category', 'skill', 'percentage', 'month', 'tenant_id'];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function classe()
    {
        return $this->belongsTo(Classes::class, 'class_id');
    }
}
