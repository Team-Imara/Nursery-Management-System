<?php


namespace App\Http\Controllers;

use App\Models\Timetable;
use Illuminate\Http\Request;

class TimetableController extends Controller
{
    public function index($classId)
    {
        return response()->json(Timetable::where('class_id', $classId)->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'day' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'time_slot' => 'required|string',
            'activity' => 'required|string',
        ]);
        $timetable = Timetable::create($validated);
        return response()->json($timetable, 201);
    }

    public function show($id)
    {
        $timetable = Timetable::findOrFail($id);
        return response()->json($timetable);
    }

    public function update(Request $request, $id)
    {
        $timetable = Timetable::findOrFail($id);
        $validated = $request->validate([
            'class_id' => 'sometimes|exists:classes,id',
            'day' => 'sometimes|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'time_slot' => 'sometimes|string',
            'activity' => 'sometimes|string',
        ]);
        $timetable->update($validated);
        return response()->json($timetable);
    }

    public function destroy($id)
    {
        $timetable = Timetable::findOrFail($id);
        $timetable->delete();
        return response()->json(null, 204);
    }
}