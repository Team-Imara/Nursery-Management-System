<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\ClassesController;
use App\Http\Controllers\TimetableController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\ObservationController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\MealPlanController;
use App\Http\Controllers\StudentMealController;
use App\Http\Controllers\TeacherAttendanceController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\NotificationController;
use App\Models\Tenant;
use Stancl\Tenancy\Database\Models\Domain;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;

// Guest routes - Move out of 'tenancy' to allow centralized login from central domains (like localhost)
Route::group([], function () {
    Route::post('/register', [UserController::class, 'store']); // Custom register in UserController
    
    Route::post('/login', function (Request $request) {
        $credentials = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string'
        ]);
        
        try {
            // Find user globally to identify their tenant (username is unique globally)
            $user = User::withoutGlobalScopes()->where('username', $credentials['username'])->first();
            
            if (!$user || !Hash::check($credentials['password'], $user->password)) {
                return response()->json(['message' => 'Invalid credentials'], 401);
            }

            // Verify tenant exists before initializing
            if (!Tenant::where('id', $user->tenant_id)->exists()) {
                 return response()->json(['message' => 'Tenant associated with this user not found'], 404);
            }

            // Initialize tenancy for this context
            tenancy()->initialize($user->tenant_id);

            // Generate JWT token
            if (!$token = auth('api')->login($user)) {
                return response()->json(['message' => 'Could not create token'], 500);
            }

            return response()->json([
                'token' => $token,
                'user' => [
                    'fullname' => $user->fullname,
                    'role' => $user->role,
                    'username' => $user->username,
                    'tenant_id' => $user->tenant_id
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Server Error during login',
                'error' => $e->getMessage()
            ], 500);
        }
    });

    Route::post('/logout', function() {
        auth('api')->logout();
        return response()->json(['message' => 'Successfully logged out']);
    });
});

Route::middleware(['auth:api', 'tenancy'])->group(function () {
    //Teacher Management
    Route::apiResource('users', UserController::class);

    // Student Management
    Route::apiResource('students', StudentController::class);

    // Class Management
    Route::apiResource('classes', ClassesController::class);

    // Timetable Management
    Route::get('timetables/{classId}', [TimetableController::class, 'index']);
    Route::post('timetables', [TimetableController::class, 'store']);
    Route::get('timetables/show/{id}', [TimetableController::class, 'show']);
    Route::put('timetables/{id}', [TimetableController::class, 'update']);
    Route::delete('timetables/{id}', [TimetableController::class, 'destroy']);

    // Attendance (FR1.2)
    Route::get('attendances', [AttendanceController::class, 'index']); // With optional ?studentId= or ?classId=
    Route::post('attendances', [AttendanceController::class, 'store']);
    Route::get('attendances/{id}', [AttendanceController::class, 'show']);
    Route::put('attendances/{id}', [AttendanceController::class, 'update']);
    Route::delete('attendances/{id}', [AttendanceController::class, 'destroy']);

    // Observations (FR2)
    Route::get('observations/{studentId}', [ObservationController::class, 'index']);
    Route::post('observations', [ObservationController::class, 'store']);
    Route::get('observations/show/{id}', [ObservationController::class, 'show']);
    Route::put('observations/{id}', [ObservationController::class, 'update']);
    Route::delete('observations/{id}', [ObservationController::class, 'destroy']);

    // Leave Requests (FR4.2-4.3)
    Route::apiResource('leave-requests', LeaveRequestController::class);
    Route::put('leave-requests/{id}/approve', [LeaveRequestController::class, 'approve']);
    Route::put('leave-requests/{id}/reject', [LeaveRequestController::class, 'reject']);

    // Events (FR6, FR8)
    Route::apiResource('events', EventController::class);

    // Meal Plans (FR7)
    Route::get('meal-plans', [MealPlanController::class, 'index']); // With optional ?classId=
    Route::post('meal-plans', [MealPlanController::class, 'store']);
    Route::get('meal-plans/{id}', [MealPlanController::class, 'show']);
    Route::put('meal-plans/{id}', [MealPlanController::class, 'update']);
    Route::delete('meal-plans/{id}', [MealPlanController::class, 'destroy']);

    // Student Meals (FR7)
    Route::get('student-meals', [StudentMealController::class, 'index']); // With ?studentId= or ?classId=
    Route::post('student-meals', [StudentMealController::class, 'store']);
    Route::get('student-meals/{id}', [StudentMealController::class, 'show']);
    Route::put('student-meals/{id}', [StudentMealController::class, 'update']);
    Route::delete('student-meals/{id}', [StudentMealController::class, 'destroy']);

    // Teacher Attendances
    Route::get('teacher-attendances', [TeacherAttendanceController::class, 'index']); // With ?teacherId=
    Route::post('teacher-attendances', [TeacherAttendanceController::class, 'store']);
    Route::get('teacher-attendances/{id}', [TeacherAttendanceController::class, 'show']);
    Route::put('teacher-attendances/{id}', [TeacherAttendanceController::class, 'update']);
    Route::delete('teacher-attendances/{id}', [TeacherAttendanceController::class, 'destroy']);

    // Reports (FR10) - Use GET with query params for dates/classId/studentId
    Route::get('reports/progress/{studentId}', [ReportController::class, 'progressReport']); // ?start= &end=
    Route::get('reports/attendance', [ReportController::class, 'attendanceReport']); // ?start= &end=
    Route::get('reports/meal-planning', [ReportController::class, 'mealPlanningReport']); // ?start= &end=
    Route::get('reports/performance-prediction/{studentId}', [ReportController::class, 'performancePredictionReport']); // ?start= &end=
    Route::get('reports/teacher-attendance-leave', [ReportController::class, 'teacherAttendanceLeaveReport']); // ?start= &end=
    Route::get('reports/teacher-class-allocation', [ReportController::class, 'teacherClassAllocationReport']);
    Route::get('reports/student-tutor-details', [ReportController::class, 'studentTutorDetailsReport']);
    Route::get('reports/event-summary', [ReportController::class, 'eventSummaryReport']); // ?start= &end=
    Route::get('reports/class-performance-summary/{classId}', [ReportController::class, 'classPerformanceSummary']); // ?start= &end=

    // Notifications Management
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::get('notifications/unread', [NotificationController::class, 'unread']);
    Route::post('notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    Route::post('notifications/send-custom', [NotificationController::class, 'sendCustom']); // Admin for custom sends
});

Route::post('/tenants', function (Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'domain' => 'required|string|unique:domains,domain',
        'admin_email' => 'required|email',
        'admin_username' => 'required|string|unique:users,username',
        'admin_fullname' => 'required|string|max:255',
        'admin_password' => 'required|string|min:8',
    ]);

    try {
        // 1. Create the Tenant
        // Use App\Models\Tenant which includes HasDomains
        $tenant = Tenant::create([
            'name' => $validated['name'],
        ]);

        // 2. Create the Domain
        $tenant->domains()->create(['domain' => $validated['domain']]);

        // 3. Initialize Tenancy to scope the admin user creation
        tenancy()->initialize($tenant);

        // 4. Create the Admin User for this tenant
        // The BelongsToTenant trait in User model will automatically set the tenant_id
        $admin = User::create([
            'fullname' => $validated['admin_fullname'],
            'email' => $validated['admin_email'],
            'username' => $validated['admin_username'],
            'password' => Hash::make($validated['admin_password']),
            'role' => 'admin',
        ]);
        
        // Assign the 'admin' role if using Spatie Permission
        // Ensure the role exists in the system
        if (\Spatie\Permission\Models\Role::where('name', 'admin')->exists()) {
            $admin->assignRole('admin');
        }

        // 5. Run tenant-specific migrations if any
        Artisan::call('tenants:migrate', ['--tenants' => [$tenant->getTenantKey()]]);

        return response()->json([
            'message' => 'Tenant and Admin created successfully',
            'tenant' => $tenant,
            'admin' => [
                'email' => $admin->email,
                'fullname' => $admin->fullname,
            ],
            'login_url' => 'http://' . $validated['domain'] . ':8000/api/login'
        ], 201);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Failed to create tenant',
            'error' => $e->getMessage()
        ], 500);
    }
});
