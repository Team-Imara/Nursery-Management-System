<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Tenant;
use App\Models\Classes;
use App\Models\Student;
use Illuminate\Support\Facades\Hash;
use Stancl\Tenancy\Database\Models\Domain;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Ensure a default tenant exists
        $tenant = Tenant::firstOrCreate(
            ['id' => 'dev-tenant'],
            [
                'name' => 'Dreamland Nursery',
                'nursery_name' => 'Dreamland International Nursery',
                'nursery_address' => '123 Sunshine Avenue, Colombo',
                'nursery_contact' => '+94 11 234 5678',
                'nursery_email' => 'hello@dreamlandnursery.com',
            ]
        );

        // 2. Associate domains
        Domain::firstOrCreate(['domain' => 'localhost'], ['tenant_id' => $tenant->id]);
        Domain::firstOrCreate(['domain' => '127.0.0.1'], ['tenant_id' => $tenant->id]);

        // 3. Initialize tenancy
        if (function_exists('tenancy')) {
            tenancy()->initialize($tenant);
        }

        // 4. Create Teachers
        $teachersData = [
            [
                'username' => 'teacher1',
                'fullname' => 'Sarah Johnson',
                'email' => 'sarah@example.com',
                'password' => Hash::make('password'),
                'role' => 'teacher',
                'tenant_id' => $tenant->id,
            ],
            [
                'username' => 'teacher2',
                'fullname' => 'Michael Chen',
                'email' => 'michael@example.com',
                'password' => Hash::make('password'),
                'role' => 'teacher',
                'tenant_id' => $tenant->id,
            ],
            [
                'username' => 'teacher3',
                'fullname' => 'Elena Rodriguez',
                'email' => 'elena@example.com',
                'password' => Hash::make('password'),
                'role' => 'teacher',
                'tenant_id' => $tenant->id,
            ],
        ];

        foreach ($teachersData as $teacher) {
            User::updateOrCreate(['username' => $teacher['username']], $teacher);
        }

        // 5. Create Admin
        $admin = User::updateOrCreate(
            ['username' => 'admin'],
            [
                'fullname' => 'System Administrator',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'tenant_id' => $tenant->id,
            ]
        );

        // 6. Create Classes
        $classesData = [
            [
                'classname' => 'Kindergarten 1-A',
                'capacity' => 25,
                'head_teacher_id' => User::where('username', 'teacher1')->first()->id,
                'tenant_id' => $tenant->id,
            ],
            [
                'classname' => 'Kindergarten 1-B',
                'capacity' => 20,
                'head_teacher_id' => User::where('username', 'teacher2')->first()->id,
                'tenant_id' => $tenant->id,
            ],
            [
                'classname' => 'Preschool Junior',
                'capacity' => 15,
                'head_teacher_id' => User::where('username', 'teacher3')->first()->id,
                'tenant_id' => $tenant->id,
            ],
        ];

        foreach ($classesData as $class) {
            Classes::updateOrCreate(['classname' => $class['classname']], $class);
        }

        // 7. Seed some Students
        $kg1a = Classes::where('classname', 'Kindergarten 1-A')->first();
        $studentsData = [
            ['fullname' => 'Alice Smith', 'dob' => '2021-05-12', 'academic_year' => '2025', 'class_id' => $kg1a->id, 'tenant_id' => $tenant->id],
            ['fullname' => 'Bob Miller', 'dob' => '2021-08-20', 'academic_year' => '2025', 'class_id' => $kg1a->id, 'tenant_id' => $tenant->id],
            ['fullname' => 'Charlie Davis', 'dob' => '2021-02-14', 'academic_year' => '2025', 'class_id' => $kg1a->id, 'tenant_id' => $tenant->id],
        ];

        foreach ($studentsData as $student) {
            Student::updateOrCreate(['fullname' => $student['fullname']], $student);
        }

        // Update enrollment counts (simulating what happens on save student usually)
        foreach (Classes::all() as $cls) {
            $cls->total_students = $cls->students()->count();
            $cls->save();
        }

        $this->command->info('Full demonstration data seeded successfully!');
    }
}
