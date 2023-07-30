<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UiRoleMapping;
use App\Models\User;

class UiRoleMappingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $uiRoleMappings = UiRoleMapping::all();

        if (!$uiRoleMappings) {
            $response = [
                'success' => false,
                'message' => 'Failed to fetch ui role mappings.'
            ];
    
            return response($response, 400);
        }

        $response = [
            'success' => true,
            'records' => $uiRoleMappings
        ];

        return response($response, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'role_id' => 'required',
            'ui_name' => 'required',
        ]);

        $user = $request->user();
        $request['created_by'] = $user->id;

        $uiRoleMapping = UiRoleMapping::create($request->all());

        if (!$uiRoleMapping) {
            $response = [
                'success' => false,
                'message' => 'Failed to create ui role mapping.'
            ];
    
            return response($response, 400);
        }

        $response = [
            'success' => true,
            'record' => $uiRoleMapping
        ];

        return response($response, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Role::find($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $uiRoleMapping = UiRoleMapping::find($id);
        $uiRoleMapping->update($request->all());
        
        if (!$uiRoleMapping) {
            $response = [
                'success' => false,
                'message' => 'Failed to delete ui role mapping.'
            ];
    
            return response($response, 400);
        }

        $response = [
            'success' => true,
            'record' => $uiRoleMapping
        ];

        return response($response, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $uiRoleMapping = UiRoleMapping::destroy($id);

        if (!$uiRoleMapping) {
            $response = [
                'success' => false,
                'message' => 'Failed to delete ui role mapping.'
            ];
    
            return response($response, 400);
        }

        $response = [
            'success' => true,
            'record' => $uiRoleMapping
        ];

        return response($response, 200);
    }

    /**
     * Display paginated records.
     */
    public function paginate(Request $request)
    {
        $search = !is_null($request->input('search')) ? $request->input('search') : '';
        $page = !is_null($request->input('page')) ? $request->input('page') : 1;
        $limit = !is_null($request->input('limit')) ? $request->input('limit') : 2;

        $uiRoleMappings = UiRoleMapping::orderBy('id', 'asc')
            ->with(['creator' => function ($r_query) {
                $r_query->select('id', User::raw("CONCAT(first_name, ' ', last_name) AS full_name"));
            }]);

        if (isset($search)) {
            $uiRoleMappings = $uiRoleMappings->where(function ($query) use ($search) {
                $query->where('ui_name', 'LIKE', '%'. $search . '%');
            });
        }

        $uiRoleMappingsTotal = $uiRoleMappings->count();
        $uiRoleMappings = $uiRoleMappings->offset(($page - 1) * $limit)
            ->limit($limit)
            ->get();

        $pages = ceil($uiRoleMappingsTotal / $limit);

        $info = (object) ['total_records' => $uiRoleMappingsTotal, 'total_pages' => $pages];

        $response = [
            'success' => true,
            'info' => $info,
            'records' => $uiRoleMappings
        ];

        return response($response, 200);
    }
}
