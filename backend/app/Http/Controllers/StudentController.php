<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        return response()->json(Student::with('classe')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'fullname' => 'required|string|max:255',
            'name_with_initials' => 'nullable|string|max:255',
            'calling_name' => 'nullable|string|max:255',
            'dob' => 'required|date',
            'gender' => 'nullable|in:male,female,other,Male,Female,Other',
            'first_language' => 'nullable|string|max:100',
            'religion' => 'nullable|string|max:100',
            
            'whatsapp_number' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'father_name' => 'nullable|string|max:255',
            'father_contact' => 'nullable|string|max:20',
            'mother_name' => 'nullable|string|max:255',
            'mother_contact' => 'nullable|string|max:20',
            'father_occupation' => 'nullable|string|max:255',
            'mother_occupation' => 'nullable|string|max:255',
            'father_nic' => 'nullable|string|max:20',
            'mother_nic' => 'nullable|string|max:20',
            'guardian_type' => 'nullable|in:father,mother,others',
            'guardian_name' => 'nullable|string|max:255',
            'guardian_contact' => 'nullable|string|max:20',
            'guardian_occupation' => 'nullable|string|max:255',
            'guardian_nic' => 'nullable|string|max:20',
            'guardian_address' => 'nullable|string|max:500',

            'class_id' => 'required|exists:classes,id',
            'section' => 'nullable|string|max:50',
            'academic_year' => 'required|string|max:20',
            'end_year' => 'nullable|string|max:20',
            'enrollment_date' => 'nullable|date',

            'assessment_reading' => 'nullable|string|max:50',
            'assessment_writing' => 'nullable|string|max:50',
            'assessment_numbers' => 'nullable|string|max:50',
            'assessment_language_tamil' => 'nullable|string|max:50',
            'assessment_language_english' => 'nullable|string|max:50',
            'assessment_language_sinhala' => 'nullable|string|max:50',
            'assessment_drawing' => 'nullable|string|max:50',
            'assessment_notes' => 'nullable|string',
        ]);
        $student = Student::create($validated);
        return response()->json($student, 201);
    }

    public function show($id)
    {
        return response()->json(Student::with('classe')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);
        $validated = $request->validate([
            'fullname' => 'sometimes|required|string|max:255',
            'name_with_initials' => 'nullable|string|max:255',
            'calling_name' => 'nullable|string|max:255',
            'dob' => 'sometimes|required|date',
            'gender' => 'nullable|in:male,female,other,Male,Female,Other',
            'first_language' => 'nullable|string|max:100',
            'religion' => 'nullable|string|max:100',
            
            'whatsapp_number' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'father_name' => 'nullable|string|max:255',
            'father_contact' => 'nullable|string|max:20',
            'mother_name' => 'nullable|string|max:255',
            'mother_contact' => 'nullable|string|max:20',
            'father_occupation' => 'nullable|string|max:255',
            'mother_occupation' => 'nullable|string|max:255',
            'father_nic' => 'nullable|string|max:20',
            'mother_nic' => 'nullable|string|max:20',
            'guardian_type' => 'nullable|in:father,mother,others',
            'guardian_name' => 'nullable|string|max:255',
            'guardian_contact' => 'nullable|string|max:20',
            'guardian_occupation' => 'nullable|string|max:255',
            'guardian_nic' => 'nullable|string|max:20',
            'guardian_address' => 'nullable|string|max:500',

            'class_id' => 'sometimes|required|exists:classes,id',
            'section' => 'nullable|string|max:50',
            'academic_year' => 'sometimes|required|string|max:20',
            'end_year' => 'nullable|string|max:20',
            'enrollment_date' => 'nullable|date',

            'assessment_reading' => 'nullable|string|max:50',
            'assessment_writing' => 'nullable|string|max:50',
            'assessment_numbers' => 'nullable|string|max:50',
            'assessment_language_tamil' => 'nullable|string|max:50',
            'assessment_language_english' => 'nullable|string|max:50',
            'assessment_language_sinhala' => 'nullable|string|max:50',
            'assessment_drawing' => 'nullable|string|max:50',
            'assessment_notes' => 'nullable|string',
        ]);
        $student->update($validated);
        return response()->json($student);
    }

    public function destroy($id)
    {
        Student::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}