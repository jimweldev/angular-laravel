<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;

use App\Models\User;
use App\Models\UserRole;

class AuthController extends Controller
{
    // register
    public function register(Request $request) {
        $fields = $request->validate([
            'username' => 'required|string|unique:users,email',
            'password' => 'required|string|confirmed',
            'email' => 'required|string|unique:users,email',
            'last_name' => 'required|string',
            'first_name' => 'required|string',
            'middle_name' => 'required|string',
            'position' => 'required|string',
        ]);

        $user = User::create([
            'username' => $fields['username'],
            'password' => bcrypt($fields['password']),
            'email' => $fields['email'],
            'last_name' => $fields['last_name'],
            'first_name' => $fields['first_name'],
            'middle_name' => $fields['middle_name'],
            'position' => $fields['position'],
        ]);

        $token = $user->createToken('myapptoken')->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token
        ], 201);
    }

    // login
    public function login(Request $request) {
        $fields = $request->validate([
            'email' => 'required|string',
            'password' => 'required|string'
        ]);

        // Check email
        $user = User::where('email', $fields['email'])
            ->select('id', 'username', 'email', 'last_name', 'first_name', 'middle_name', 'position', 'password','is_admin')
            ->first();

        if (!$user || !Hash::check($fields['password'], $user->password)) {
            return response([
                'message' => 'Bad credentials'
            ], 401);
        }

        $token = $user->createToken('myapptoken')->plainTextToken;

        $userRoles = UserRole::where('user_id', $user->id)
            ->with('role.role_permissions.permissions')
            ->get()
            ->map(function ($userRole) {
                return [
                    'role' => $userRole->role->name,
                    'permissions' => $userRole->role->role_permissions->map(function ($rolePermission) {
                        return $rolePermission->permissions->map(function ($permission) {
                            return $permission->name;
                        });
                    })->flatten()->toArray(),
                ];
            });

        return response([
            'user' => $user,
            'roles' => $userRoles,
            'token' => $token
        ], 200);
    }

    // logout
    public function logout(Request $request) {
        auth()->user()->tokens()->delete();

        return [
            'message' => 'Logged out'
        ];
    }


    public function getuser(Request $request) {
        $user = User::get();

        return response([
            'data' => $user,
        ], 200);
    }
}
