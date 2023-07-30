<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Permission;
use App\Models\User;
use App\Models\RolePermission;

class PermissionController extends Controller
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
            $data = Permission::where($query)
                ->get();
        } else {
            $data = Permission::get();
        }

        if (!$data) {
            return response([
                'message' => 'Failed to fetch permissions.'
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
            'name' => 'required',
            'controller' => 'required',
            'function_name' => 'required',
        ]);

        $request->replace(array_filter($request->all(), function ($value) {
            return !empty($value);
        }));

        $user = $request->user();
        $request['created_by'] = $user->id;

        $data = Permission::create($request->all());

        if (!$data) {
            return response([
                'message' => 'Failed to create permission.'
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
        $data = Permission::find($id);

        if (!$data) {
            return response([
                'message' => 'Permission not found.'
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
        
        $data = Permission::find($id)->update($request->all());

        if (!$data) {    
            return response([
                'message' => 'Failed to update permission.'
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
        $rolePermissions = RolePermission::where('permission_id', $id)->get();
        if (!$rolePermissions->isEmpty()) {
            return response([
                'message' => 'Cannot delete permission.'
            ], 400);
        }

        $data = Permission::find($id);
        
        if (!$data) {
            return response([
                'message' => 'Permission not found.'
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

        $data = Permission::orderBy('id', 'asc')
            ->with(['creator' => function ($query) {
                $query->select('id', User::raw("CONCAT(first_name, ' ', last_name) AS full_name"));
            }]);

        if (isset($search)) {
            $data = $data->where(function ($query) use ($search) {
                $query->where('name', 'LIKE', '%'. $search . '%')
                ->orWhere('controller', 'LIKE', '%'. $search . '%')
                ->orWhere('function_name', 'LIKE', '%'. $search . '%');
            });
        }

        $dataTotal = $data->count();
        $data = $data->offset(($page - 1) * $limit)
            ->limit($limit)
            ->get();

        if (!$data) {    
            return response([
                'message' => 'Failed to fetch roles.'
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
