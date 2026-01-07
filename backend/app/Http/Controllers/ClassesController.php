<?php


namespace App\Http\Controllers;

use App\Models\Classes;
use Illuminate\Http\Request;

class ClassesController extends Controller
{
    public function index()
    {
        return response()->json(Classes::with(['headTeacher', 'assistantTeachers'])->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'classname' => 'required|string|max:255',
            'capacity' => 'required|integer',
            'head_teacher_id' => 'required|exists:users,id',
            // Assistant teachers via attach after
        ]);
        $classes = Classes::create($validated);
        if ($request->has('assistant_teacher_ids')) {
            $classes->assistantTeachers()->attach($request->assistant_teacher_ids);
        }
        return response()->json($classes, 201);
    }

    public function show($id)
    {
        return response()->json(Classes::with(['headTeacher', 'assistantTeachers', 'students'])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $classes = Classes::findOrFail($id);
        $validated = $request->validate([
            // Validation
        ]);
        $classes->update($validated);
        if ($request->has('assistant_teacher_ids')) {
            $classes->assistantTeachers()->sync($request->assistant_teacher_ids);
        }
        return response()->json($classes);
    }

    public function destroy($id)
    {
        Classes::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}