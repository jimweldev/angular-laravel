<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserRole;
use App\Models\Role;

class UserRoleController extends Controller
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
            $data = UserRole::where($query)
                ->with('role')
                ->with(['user' => function ($query) {
                    $query->select('id', 'username', 'first_name', 'last_name');
                }])
                ->get();
        } else {
            $data = UserRole::with('role')
                ->with(['user' => function ($query) {
                    $query->select('id', 'username', 'first_name', 'last_name');
                }])
                ->get();
        }

        if (!$data) {
            return response([
                'message' => 'Failed to fetch user roles.'
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
        $request->validate([
            'user_id' => 'required',
            'role_id' => 'required',
        ]);

        $request->replace(array_filter($request->all(), function ($value) {
            return !empty($value);
        }));

        $user = $request->user();
        $request['created_by'] = $user->id;

        $userRoles = UserRole::where('user_id', $request['user_id'])
            ->where('role_id', $request['role_id'])
            ->get();

        if (!$userRoles->isEmpty()) {
            return response([
                'message' => 'Failed to create user role.'
            ], 400);
        }

        $data = UserRole::create($request->all());

        if (!$data) {
            return response([
                'message' => 'Failed to create user role.'
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
        $data = UserRole::find($id);

        if (!$data) {
            return response([
                'message' => 'User Role not found.'
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
        $request->replace(array_filter($request->all(), function ($value) {
            return !empty($value);
        }));
        
        $data = UserRole::find($id)->update($request->all());

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
        $data = UserRole::find($id);
        
        if (!$data) {
            return response([
                'message' => 'Role permission not found.'
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

        $data = UserRole::orderBy('id', 'asc')
            ->with('user')
            ->with('role')
            ->with(['creator' => function ($query) {
                $query->select('id', User::raw("CONCAT(first_name, ' ', last_name) AS full_name"));
            }]);

        if (isset($search)) {
            $data = $data->where(function ($query) use ($search) {
                $query->whereHas('role', function ($query) use ($search) {
                    $query->where('name', 'LIKE', '%'. $search . '%');
                });
                $query->orWhereHas('user', function ($query) use ($search) {
                    $query->where('first_name', 'LIKE', '%'. $search . '%')
                        ->orWhere('middle_name', 'LIKE', '%'. $search . '%')
                        ->orWhere('last_name', 'LIKE', '%'. $search . '%');
                });
            });
        }

        $dataTotal = $data->count();
        $data = $data->offset(($page - 1) * $limit)
            ->limit($limit)
            ->get();

        if (!$data) {    
            return response([
                'message' => 'Failed to fetch user roles.'
            ], 400);
        }

        $pages = ceil($dataTotal / $limit);

        $info = (object) ['total_records' => $dataTotal, 'total_pages' => $pages];

        return response([
            'info' => $info,
            'records' => $data
        ], 200);
    }
}
