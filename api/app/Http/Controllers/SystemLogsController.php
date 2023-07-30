<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\SystemLogs;

class SystemLogsController extends Controller
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
            $data = SystemLogs::where($query)
                ->get();
        } else {
            $data = SystemLogs::get();
        }

        if (!$data) {
            return response([
                'message' => 'Failed to fetch systemLogs.'
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
        $request->replace(array_filter($request->all(), function ($value) {
            return !empty($value);
        }));

        $user = $request->user();
        $request['created_by'] = $user->id;

        $data = SystemLogs::create($request->all());

        if (!$data) {
            return response([
                'message' => 'Failed to create systemLog.'
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
        $data = SystemLogs::find($id);

        if (!$data) {
            return response([
                'message' => 'SystemLog not found.'
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
        
        $data = SystemLogs::find($id)->update($request->all());

        if (!$data) {    
            return response([
                'message' => 'Failed to update systemLog.'
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
        $data = SystemLogs::find($id);
        
        if (!$data) {
            return response([
                'message' => 'SystemLog not found.'
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

        $data = SystemLogs::orderBy('id', 'desc');

        if (isset($search)) {
            $data = $data->where(function ($query) use ($search) {
                $query->where('program_name', 'LIKE', '%'. $search . '%')
                ->orWhere('activity', 'LIKE', '%'. $search . '%')
                ->orWhere('remarks', 'LIKE', '%'. $search . '%')
                ->orWhere('start_time', 'LIKE', '%'. $search . '%')
                ->orWhere('end_time', 'LIKE', '%'. $search . '%');
            });
        }

        $dataTotal = $data->count();
        $data = $data->offset(($page - 1) * $limit)
            ->limit($limit)
            ->get();

        if (!$data) {    
            return response([
                'message' => 'Failed to fetch systemLogs.'
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