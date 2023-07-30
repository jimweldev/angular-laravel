<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\UserRole;
use App\Http\Controllers\RbacController;

use App\Models\Role;
// use App\Models\UserRole;
use App\Models\RolePermission;
use App\Models\Permission;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query_data = $request->all();
        $query = [];

        foreach($query_data as $q_key => $q_value) {
            $query[] = [$q_key, $q_value];
        }

        if (!empty($query)) {
            $data = User::where($query)
                ->get();
        } else {
            $data = User::all();
        }

        if (!$data) {
            return response([
                'message' => 'Failed to fetch users.'
            ], 400);
        }

        return response([
            'records' => $data
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'username' => 'required|string|unique:users,email',
            'password' => 'required|string|confirmed',
            'email' => 'required|string|unique:users,email',
            'alternate_email' => 'string|unique:users,email',
            'last_name' => 'required|string',
            'first_name' => 'required|string',
            'middle_name' => 'string',
            'position' => 'string',
        ]);

        $user = $request->user();     

        $data = User::create([
            'username' => $fields['username'],
            'password' => bcrypt($fields['password']),
            'email' => $fields['email'],
            'last_name' => $fields['last_name'],
            'first_name' => $fields['first_name'],
            'middle_name' => $fields['middle_name'],
            'position' => $fields['position'],
            'created_by' => $user->id,
        ]);

        if (!$data) {
            return response([
                'message' => 'Failed to create user.'
            ], 400);
        }

        return response([
            'record' => $data
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = User::find($id);

        if (!$data) {
            return response([
                'message' => 'User not found.'
            ], 400);
        }

        return response([
            'record' => $data
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $data = User::find($id)->update($request->all());

        if (!$data) {    
            return response([
                'message' => 'Failed to update user.'
            ], 400);
        }

        return response([
            'record' => $data
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $data = User::find($id);
        
        if (!$data) {
            return response([
                'message' => 'User not found.'
            ], 400);
        } else {
            $data->delete();
        }

        return response([
            'record' => $data
        ], 200);
    }

    /**
     * Display paginated records.
     */
    public function paginate(Request $request)
    {
        $search = !is_null($request->input('search')) ? $request->input('search') : '';
        $page = !is_null($request->input('page')) ? $request->input('page') : 1;
        $limit = !is_null($request->input('limit')) ? $request->input('limit') : 10;

        $data = User::orderBy('id', 'asc')
            ->with(['creator' => function ($query) {
                $query->select('id', User::raw("CONCAT(first_name, ' ', last_name) AS full_name"));
            }]);

        if (isset($search)) {
            $data = $data->where(function ($query) use ($search) {
                $query->where('last_name', 'LIKE', '%'. $search . '%')
                    ->orWhere('first_name', 'LIKE', '%'. $search . '%')
                    ->orWhere('middle_name', 'LIKE', '%'. $search . '%')
                    ->orWhere('position', 'LIKE', '%'. $search . '%')
                    ->orWhere('email', 'LIKE', '%'. $search . '%')
                    ->orWhere('alternate_email', 'LIKE', '%'. $search . '%')
                    ->orWhere('username', 'LIKE', '%'. $search . '%');
            });
        }

        $dataTotal = $data->count();
        $data = $data->offset(($page - 1) * $limit)
            ->limit($limit)
            ->get();

        if (!$data) {    
            return response([
                'message' => 'Failed to fetch users.'
            ], 400);
        }

        $pages = ceil($dataTotal / $limit);

        $info = (object) ['total_records' => $dataTotal, 'total_pages' => $pages];

        return response([
            'info' => $info,
            'records' => $data
        ], 200);
    }

    /**
     * Get my user info.
     */
    public function get_me(Request $request)
    {
        $user = $request->user();    

        $user = User::where('id', $user->id)
            ->with('creator')
            ->first();

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

        if (!$user) {
            return response([
                'message' => 'User not found.'
            ], 400);
        }

        return response([
            'user' => $user,
            'roles' => $userRoles
        ], 200);
    }

    /**
     * Check if user has permission.
     */
    public function rbac_test(Request $request)
    {
        $user = $request->user();

        if (!RbacController::isAllowed('permission 1', $user)) {    
            return response([
                'message' => 'Forbidden.'
            ], 403);
        }

        return response([
            'has_access' => true,
        ], 200);
    }
}
