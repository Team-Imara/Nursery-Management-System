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

use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject {
    use HasApiTokens, HasFactory, Notifiable, HasRoles, BelongsToTenant;

   protected $fillable = [
    'fullname',
    'email',
    'username',
    'password',
    'role',
    'phone',
    'teaching_subject',
    'assigned_class_text',
    'room_text',
    'experience',
    'status',
    'profile_photo',
    'join_date',
    'qualification',
    'bio'
];

    protected $hidden = ['password', 'remember_token'];

    protected $appends = ['profile_photo_url', 'image'];
    
    public function getProfilePhotoUrlAttribute()
    {
        if (!$this->profile_photo) return null;
        if (str_starts_with($this->profile_photo, 'http')) return $this->profile_photo;
        return \Illuminate\Support\Facades\Storage::disk('public')->url($this->profile_photo);
    }

    public function getImageAttribute()
    {
        return $this->profile_photo_url;
    }

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

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }
}