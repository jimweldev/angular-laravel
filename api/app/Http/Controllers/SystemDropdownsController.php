<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\SystemDropdowns;

class SystemDropdownsController extends Controller
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
            $data = SystemDropdowns::where($query)
                ->get();
        } else {
            $data = SystemDropdowns::get();
        }

        if (!$data) {
            return response([
                'message' => 'Failed to fetch systemDropdowns.'
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
        ]);

        $request->replace(array_filter($request->all(), function ($value) {
            return !empty($value);
        }));

        $user = $request->user();
        $request['created_by'] = $user->id;

        $data = SystemDropdowns::create($request->all());

        if (!$data) {
            return response([
                'message' => 'Failed to create systemDropdown.'
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
        $data = SystemDropdowns::find($id);

        if (!$data) {
            return response([
                'message' => 'SystemDropdown not found.'
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
        
        $data = SystemDropdowns::find($id)->update($request->all());

        if (!$data) {    
            return response([
                'message' => 'Failed to update systemDropdown.'
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
        $data = SystemDropdowns::find($id);
        
        if (!$data) {
            return response([
                'message' => 'SystemDropdown not found.'
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

        $data = SystemDropdowns::orderBy('id', 'asc')
            ->with(['creator' => function ($query) {
                $query->select('id', User::raw("CONCAT(first_name, ' ', last_name) AS full_name"));
            }]);

        if (isset($search)) {
            $data = $data->where(function ($query) use ($search) {
                $query->where('module', 'LIKE', '%'. $search . '%')
                ->orWhere('name', 'LIKE', '%'. $search . '%')
                ->orWhere('value', 'LIKE', '%'. $search . '%')
                ->orWhere('default', 'LIKE', '%'. $search . '%');
            });
        }

        $dataTotal = $data->count();
        $data = $data->offset(($page - 1) * $limit)
            ->limit($limit)
            ->get();

        if (!$data) {    
            return response([
                'message' => 'Failed to fetch systemDropdowns.'
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