<?php

// app/Models/User.php (update Breeze's)
namespace App\Models;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class User extends Authenticatable {
    use HasApiTokens, HasFactory, Notifiable, HasRoles, BelongsToTenant;

    protected $fillable = [
        'fullname', 'dob', 'email', 'password', 'role', 'phone', 'address', 'nic',
        'emergency_contact_name', 'emergency_contact_phone', 'teaching_subject',
        'basic_salary', 'join_date', 'qualification', 'experience', 'profile_photo', 'tenant_id'
    ];

    protected $hidden = ['password', 'remember_token'];

    public function classes() {
        return $this->belongsToMany(Classes::class, 'class_teacher', 'teacher_id', 'class_id'); // Note: Use 'Classe' to avoid 'class' keyword
    }
    public function headClasses() {
        return $this->hasMany(Classes::class, 'head_teacher_id');
    }
    public function leaveRequests() {
        return $this->hasMany(LeaveRequest::class, 'teacher_id');
    }
    public function teacherAttendances() {
        return $this->hasMany(TeacherAttendance::class, 'teacher_id');
    }
    public function routeNotificationForNotifyLk($notification){
    return $this->phone; // Or emergency_contact_phone
}
}