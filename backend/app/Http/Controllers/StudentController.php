<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $query = Student::with('classe');

        if ($request->has('class_id')) {
            $query->where('class_id', $request->class_id);
        }

        if ($request->has('section')) {
            $query->where('section', $request->section);
        }

        return response()->json($query->get());
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

            // New fields
            'uniform_details' => 'nullable|string|max:255',
            'favourite_toys' => 'nullable|string|max:255',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'allergies' => 'nullable|string',
            'height' => 'nullable|numeric',
            'weight' => 'nullable|numeric',
            'special_needs' => 'nullable|string',
            'health_notes' => 'nullable|string',
            'image' => 'nullable|string', // Base64 string
        ]);

        if ($request->has('image') && !empty($request->image) && str_starts_with($request->image, 'data:image')) {
            $validated['image'] = $this->saveImage($request->image);
        }

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

            // New fields
            'uniform_details' => 'nullable|string|max:255',
            'favourite_toys' => 'nullable|string|max:255',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'allergies' => 'nullable|string',
            'height' => 'nullable|numeric',
            'weight' => 'nullable|numeric',
            'special_needs' => 'nullable|string',
            'health_notes' => 'nullable|string',
            'image' => 'nullable|string', // Base64 string
        ]);

        if ($request->has('image') && !empty($request->image) && str_starts_with($request->image, 'data:image')) {
            if ($student->getRawOriginal('image')) {
                Storage::disk('public')->delete($student->getRawOriginal('image'));
            }
            $validated['image'] = $this->saveImage($request->image);
        }

        $student->update($validated);
        return response()->json($student);
    }

    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        if ($student->getRawOriginal('image')) {
            Storage::disk('public')->delete($student->getRawOriginal('image'));
        }
        $student->delete();
        return response()->json(null, 204);
    }

    private function saveImage($base64Image)
    {
        $image_service_str = explode(';', $base64Image)[0];
        $extension = explode('/', $image_service_str)[1];
        $fileName = Str::random(10) . '.' . $extension;
        $imageData = substr($base64Image, strpos($base64Image, ',') + 1);
        $imageData = base64_decode($imageData);

        $path = "students/" . tenancy()->tenant->id . "/" . $fileName;
        Storage::disk('public')->put($path, $imageData);

        return $path;
    }
}