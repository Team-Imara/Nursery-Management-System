<?php 
// app/Models/Student.php
namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends BaseTenantModel
{
    use SoftDeletes;

    protected $fillable = [
        'fullname', 'name_with_initials', 'calling_name', 'dob', 'gender', 'address', 'academic_year', 'end_year', 'enrollment_date', 'religion', 'uniform_details',
        'favourite_toys', 'first_language', 'class_id', 'section', 'mother_name', 'mother_contact', 'mother_occupation', 'mother_nic',
        'father_name', 'father_contact', 'father_occupation', 'father_nic', 'whatsapp_number', 'guardian_type', 'guardian_name', 'guardian_contact',
        'guardian_occupation', 'guardian_nic', 'guardian_address', 'emergency_contact_name', 'emergency_contact_phone',
        'allergies', 'height', 'weight', 'special_needs', 'health_notes', 'tenant_id',
        'assessment_reading', 'assessment_writing', 'assessment_numbers', 'assessment_language_tamil',
        'assessment_language_english', 'assessment_language_sinhala', 'assessment_drawing', 'assessment_notes'
    ];

    protected function casts(): array
    {
        return [
            'dob' => 'date',
            'enrollment_date' => 'date',
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