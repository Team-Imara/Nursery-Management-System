<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tenant;
use App\Models\User;
use App\Models\Classes;
use App\Models\Student;
use App\Models\Domain;
use Illuminate\Support\Facades\Hash;

class DevTenantSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create or Find Tenant
        $tenant = Tenant::firstOrCreate(['id' => 'dev-tenant']);
        
        // 2. Create or Find Domain
        foreach (['tenant1.localhost', 'localhost', '127.0.0.1'] as $domain) {
            if (!$tenant->domains()->where('domain', $domain)->exists()) {
                $tenant->domains()->create(['domain' => $domain]);
            }
        }

        // 3. Initialize Tenancy for session
        tenancy()->initialize($tenant);

        // 4. Create an Admin User for this tenant
        $admin = User::firstOrCreate(
            ['username' => 'admin'],
            [
                'fullname' => 'Admin User',
                'email' => 'admin@nursery.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'tenant_id' => $tenant->id,
            ]
        );

        // 5. Create a Class
        $class = Classes::firstOrCreate(
            ['classname' => 'Kindergarten', 'tenant_id' => $tenant->id],
            [
                'capacity' => 20,
                'head_teacher_id' => $admin->id,
            ]
        );

        // 6. Create a Student
        Student::firstOrCreate(
            ['fullname' => 'John Doe', 'tenant_id' => $tenant->id],
            [
                'dob' => '2020-01-01',
                'academic_year' => '2025',
                'class_id' => $class->id,
            ]
        );

        echo "Dev tenant and data created/verified successfully!\n";
        echo "Tenant ID: " . $tenant->id . "\n";
        echo "Class ID: " . $class->id . "\n";
    }
}
