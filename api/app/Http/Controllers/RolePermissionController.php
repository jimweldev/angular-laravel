<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RolePermission;
use Illuminate\Support\Facades\DB;

class RolePermissionController extends Controller
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
            $data = RolePermission::where($query)
                ->with('role')
                ->with('permission')
                ->get();
        } else {
            $data = RolePermission::with('role')
                ->with('permission')
                ->get();
        }

        if (!$data) {
            return response([
                'message' => 'Failed to fetch role permissions.'
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
            'role_id' => 'required',
            'permission_ids' => 'required',
        ]);

        $user = $request->user();
        $createdBy = $user->id;
        $roleId = $request['role_id'];
        $permissionIds = $request['permission_ids'];

        $data = [
            'role_id' => $roleId
        ];

        DB::beginTransaction();
        foreach ($permissionIds as $permissionId) {
            $rolePermissions = RolePermission::where('role_id', $roleId)
                ->where('permission_id', $permissionId)
                ->get();

            if (!$rolePermissions->isEmpty()) {
                continue;
            }

            $data = RolePermission::create([
                'role_id' => $roleId,
                'permission_id' => $permissionId,
                'created_by' => $createdBy
            ]);

            if (!$data) {
                DB::rollBack();
                return response([
                    'message' => 'Failed to create role permission.'
                ], 400);
            }
        }

        DB::commit();
        return response([
            'record' => $data
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = RolePermission::find($id);

        if (!$data) {
            return response([
                'message' => 'Role permission not found.'
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
        
        $data = RolePermission::find($id)->update($request->all());

        if (!$data) {    
            return response([
                'message' => 'Failed to update role permission.'
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
        $data = RolePermission::find($id);
        
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
}
