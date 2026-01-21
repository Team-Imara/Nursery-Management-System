<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    public function index()
    {
        $tenant = tenancy()->tenant;
        $user = auth()->user();

        return response()->json([
            'nursery' => [
                'name' => $tenant->nursery_name ?? $tenant->name ?? 'Nursery Name', // Fallback
                'address' => $tenant->nursery_address,
                'contact' => $tenant->nursery_contact,
                'email' => $tenant->nursery_email,
                'logo_url' => $tenant->nursery_logo ? Storage::disk('public')->url($tenant->nursery_logo) : null,
            ],
            'admin' => [
                'fullname' => $user->fullname,
                'address' => $user->address,
                'contact' => $user->phone,
                'email' => $user->email,
                'role' => $user->role,
                'profile_photo_url' => $user->profile_photo ? Storage::disk('public')->url($user->profile_photo) : null,
            ]
        ]);
    }

    public function updateNursery(Request $request)
    {
        $tenant = tenancy()->tenant;

        $validated = $request->validate([
            'nursery_name' => 'nullable|string|max:255',
            'nursery_address' => 'nullable|string|max:255',
            'nursery_contact' => 'nullable|string|max:255',
            'nursery_email' => 'nullable|email|max:255',
            'nursery_logo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('nursery_logo')) {
            if ($tenant->nursery_logo) {
                Storage::disk('public')->delete($tenant->nursery_logo);
            }
            $path = $request->file('nursery_logo')->storeAs(
                "tenants/{$tenant->id}", 
                'logo_' . time() . '.' . $request->file('nursery_logo')->getClientOriginalExtension(), 
                'public'
            );
            $tenant->nursery_logo = $path;
        }

        // Only update fields that are present in the request
        if ($request->has('nursery_name')) $tenant->nursery_name = $request->nursery_name;
        if ($request->has('nursery_address')) $tenant->nursery_address = $request->nursery_address;
        if ($request->has('nursery_contact')) $tenant->nursery_contact = $request->nursery_contact;
        if ($request->has('nursery_email')) $tenant->nursery_email = $request->nursery_email;
        
        $tenant->save();

        return response()->json([
            'message' => 'Nursery details updated',
            'logo_url' => $tenant->nursery_logo ? Storage::disk('public')->url($tenant->nursery_logo) : null
        ]);
    }

    public function updateAdmin(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'fullname' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'contact' => 'nullable|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'profile_picture' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('profile_picture')) {
            if ($user->profile_photo) {
                Storage::disk('public')->delete($user->profile_photo);
            }
            $path = $request->file('profile_picture')->storeAs(
                "tenants/" . tenancy()->tenant->id . "/avatars", 
                "user_{$user->id}_" . time() . "." . $request->file('profile_picture')->getClientOriginalExtension(),
                'public'
            );
            $user->profile_photo = $path;
        }

        $user->fullname = $validated['fullname'];
        $user->address = $validated['address'] ?? $user->address;
        $user->phone = $validated['contact'] ?? $user->phone;
        $user->email = $validated['email'];
        $user->save();

        return response()->json([
            'message' => 'Admin details updated',
            'profile_photo_url' => $user->profile_photo ? Storage::disk('public')->url($user->profile_photo) : null
        ]);
    }
}
