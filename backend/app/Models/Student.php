<?php 
// app/Models/Student.php
namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends BaseTenantModel
{
    use SoftDeletes;

    protected $fillable = [
        'fullname', 'dob', 'gender', 'address', 'academic_year', 'religion', 'uniform_details',
        'favourite_toys', 'first_language', 'class_id', 'mother_name', 'mother_contact', 'mother_occupation', 'mother_nic',
        'father_name', 'father_contact', 'father_occupation', 'father_nic', 'guardian_name', 'guardian_contact',
        'guardian_occupation', 'guardian_nic', 'emergency_contact_name', 'emergency_contact_phone',
        'allergies', 'height', 'weight', 'special_needs', 'health_notes', 'tenant_id'
    ];

    protected function casts(): array
    {
        return [
            'dob' => 'date',
            'height' => 'decimal:2',
            'weight' => 'decimal:2',
        ];
    }

    public function classe()
    {
        return $this->belongsTo(Classes::class, 'class_id');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function observations()
    {
        return $this->hasMany(Observation::class);
    }

    public function studentMeals()
    {
        return $this->hasMany(StudentMeal::class);
    }
}