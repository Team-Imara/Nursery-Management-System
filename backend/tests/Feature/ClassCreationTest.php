<?php

namespace Tests\Feature;

use App\Models\Classes;
use App\Models\User;
use App\Models\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClassCreationTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_class_with_new_fields()
    {
        $tenant = Tenant::create(['id' => 'test-tenant', 'name' => 'Test Nursery']);
        $headTeacher = User::factory()->create(['role' => 'teacher', 'tenant_id' => $tenant->id]);
        $classIncharge = User::factory()->create(['role' => 'teacher', 'tenant_id' => $tenant->id]);
        $assistant1 = User::factory()->create(['role' => 'teacher', 'tenant_id' => $tenant->id]);
        $assistant2 = User::factory()->create(['role' => 'teacher', 'tenant_id' => $tenant->id]);

        $response = $this->actingAs($headTeacher)->postJson('/api/classes', [
            'classname' => 'KG1',
            'capacity' => 25,
            'sections' => ['A', 'B'],
            'head_teacher_id' => $headTeacher->id,
            'class_incharge_id' => $classIncharge->id,
            'assistant_teacher_ids' => [$assistant1->id, $assistant2->id],
            'tenant_id' => $tenant->id,
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('classes', [
            'classname' => 'KG1',
            'capacity' => 25,
            'head_teacher_id' => $headTeacher->id,
            'class_incharge_id' => $classIncharge->id,
        ]);

        $class = Classes::where('classname', 'KG1')->first();
        $this->assertEquals(['A', 'B'], $class->sections);
        $this->assertCount(2, $class->assistantTeachers);
    }
}
