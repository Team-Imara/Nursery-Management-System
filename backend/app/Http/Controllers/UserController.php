<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }
        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'fullname' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'username' => 'required|string|unique:users,username',
                'password' => 'required|string|min:6',
                'role' => 'required|in:admin,teacher',
                'phone' => 'nullable|string',
                'teaching_subject' => 'nullable|string',
                'assigned_class_text' => 'nullable|string',
                'room_text' => 'nullable|string',
                'experience' => 'nullable|string',
                'status' => 'nullable|string',
                'profile_photo' => 'nullable',
                'join_date' => 'nullable|date',
                'qualification' => 'nullable|string',
                'bio' => 'nullable|string',
            ]);

            $plainPassword = $validated['password'];
            $validated['password'] = Hash::make($validated['password']);

            // Image upload
            if (!empty($validated['profile_photo']) && str_contains($validated['profile_photo'], 'base64')) {
                $data = explode(',', $validated['profile_photo'])[1];
                $data = base64_decode($data);

                $fileName = 'profile_photos/' . time() . '.jpg';
                Storage::disk('public')->put($fileName, $data);

                $validated['profile_photo'] = '/storage/' . $fileName;
            }

            $user = User::create($validated);

            // SAFE role assignment
            if (method_exists($user, 'assignRole')) {
                try {
                    $user->assignRole($validated['role']);
                } catch (\Exception $e) {}
            }

            // SAFE notification
            if ($validated['role'] === 'teacher') {
                try {
                    $user->notify(new \App\Notifications\TeacherCredentialsNotification(
                        $user->username,
                        $plainPassword
                    ));
                } catch (\Exception $e) {}
            }

            return response()->json([
                'message' => 'Teacher created successfully',
                'user' => $user
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Server error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        return response()->json(User::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'fullname' => 'sometimes|string|max:255',
            'email' => 'sometimes|email',
            'username' => 'sometimes|string',
            'password' => 'sometimes|min:6',
            'phone' => 'nullable|string',
            'teaching_subject' => 'nullable|string',
            'assigned_class_text' => 'nullable|string',
            'room_text' => 'nullable|string',
            'experience' => 'nullable|string',
            'status' => 'nullable|string',
            'profile_photo' => 'nullable',
            'join_date' => 'nullable|date',
            'qualification' => 'nullable|string',
            'bio' => 'nullable|string',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        // Image upload for update
        if (!empty($validated['profile_photo']) && str_contains($validated['profile_photo'], 'base64')) {
            $data = explode(',', $validated['profile_photo'])[1];
            $data = base64_decode($data);
            $fileName = 'profile_photos/' . time() . '.jpg';
            Storage::disk('public')->put($fileName, $data);
            $validated['profile_photo'] = '/storage/' . $fileName;
        }

        $user->update($validated);

        return response()->json($user);
    }

    public function destroy($id)
    {
        User::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}