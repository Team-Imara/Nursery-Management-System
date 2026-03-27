<?php

namespace App\Http\Controllers;

use App\Models\SkillRecord;
use App\Models\Student;
use Illuminate\Http\Request;

class SkillRecordController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'class_id' => 'required|exists:classes,id',
            'month' => 'required'
        ]);

        $records = SkillRecord::where('class_id', $request->class_id)
            ->where('month', $request->month)
            ->get();

        return response()->json($records);
    }

    public function bulkStore(Request $request)
    {
        $request->validate([
            'records' => 'required|array',
            'records.*.student_id' => 'required|exists:students,id',
            'records.*.class_id' => 'required',
            'records.*.category' => 'required',
            'records.*.skill' => 'required',
            'records.*.percentage' => 'required|integer',
            'records.*.month' => 'required'
        ]);

        foreach ($request->records as $data) {
            SkillRecord::updateOrCreate(
                [
                    'student_id' => $data['student_id'],
                    'category' => $data['category'],
                    'skill' => $data['skill'],
                    'month' => $data['month'],
                    'tenant_id' => tenant('id')
                ],
                [
                    'class_id' => $data['class_id'],
                    'percentage' => $data['percentage']
                ]
            );
        }

        return response()->json(['message' => 'Skills updated successfully']);
    }
}
