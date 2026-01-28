<?php


namespace App\Http\Controllers;

use App\Models\Classes;
use Illuminate\Http\Request;

class ClassesController extends Controller
{
    public function index()
    {
        return response()->json(Classes::with(['headTeacher', 'classIncharge', 'assistantTeachers'])->get());
    }

    public function store(Request $request)
    {
        \Log::info('ClassesController@store called', ['payload' => $request->all(), 'tenant' => tenant('id')]);

        $validated = $request->validate([
            'classname' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'head_teacher_id' => 'required|exists:users,id',
            'class_incharge_id' => 'nullable',
            'sections' => 'nullable|array',
        ]);

        // Prevent rapid duplicates (within 5 seconds)
        $existing = Classes::where('classname', $validated['classname'])
            ->where('tenant_id', tenant('id'))
            ->where('created_at', '>=', now()->subSeconds(5))
            ->first();

        if ($existing) {
            \Log::warning('Duplicate class creation prevented', ['classname' => $validated['classname']]);
            return response()->json($existing->load(['headTeacher', 'classIncharge', 'assistantTeachers']), 201);
        }

        if (empty($validated['class_incharge_id'])) {
            $validated['class_incharge_id'] = null;
        }

        $validated['tenant_id'] = tenant('id');
        
        \Log::info('Creating class with validated data', $validated);
        $classes = Classes::create($validated);
        
        if ($request->has('assistant_teacher_ids') && !empty($request->assistant_teacher_ids)) {
            \Log::info('Syncing assistant teachers', ['ids' => $request->assistant_teacher_ids]);
            $syncData = [];
            foreach ($request->assistant_teacher_ids as $teacherId) {
                $syncData[$teacherId] = ['tenant_id' => tenant('id')];
            }
            $classes->assistantTeachers()->attach($syncData);
        }
        
        $classes->load(['headTeacher', 'classIncharge', 'assistantTeachers']);
        \Log::info('Class created successfully', ['id' => $classes->id, 'head_teacher' => $classes->headTeacher->fullname ?? 'None']);

        return response()->json($classes, 201);
    }

    public function show($id)
    {
        return response()->json(Classes::with(['headTeacher', 'classIncharge', 'assistantTeachers', 'students'])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $classes = Classes::findOrFail($id);
        $validated = $request->validate([
            'classname' => 'sometimes|string|max:255',
            'capacity' => 'sometimes|integer|min:1',
            'head_teacher_id' => 'sometimes|exists:users,id',
            'class_incharge_id' => 'nullable',
            'sections' => 'nullable|array',
        ]);

        if (isset($validated['class_incharge_id']) && empty($validated['class_incharge_id'])) {
            $validated['class_incharge_id'] = null;
        }

        $classes->update($validated);

        if ($request->has('assistant_teacher_ids')) {
            $syncData = [];
            foreach ($request->assistant_teacher_ids as $teacherId) {
                $syncData[$teacherId] = ['tenant_id' => tenant('id')];
            }
            $classes->assistantTeachers()->sync($syncData);
        }

        return response()->json($classes->load(['headTeacher', 'classIncharge', 'assistantTeachers']));
    }

    public function destroy($id)
    {
        Classes::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}