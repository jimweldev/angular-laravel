<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;
use App\Models\User;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $client = Client::all();

        if (!$client) {
            $response = [
                'success' => false,
                'message' => 'Failed to create client.'
            ];
    
            return response($response, 400);
        }

        $response = [
            'success' => true,
            'records' => $client
        ];

        return response($response, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
        ]);

        $user = $request->user();
        $request['created_by'] = $user->id;

        $client = Client::create($request->all());

        if (!$client) {
            $response = [
                'success' => false,
                'message' => 'Failed to create client.'
            ];
    
            return response($response, 400);
        }

        $response = [
            'success' => true,
            'record' => $client
        ];

        return response($response, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Client::find($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $client = Client::find($id);
        $client->update($request->all());
        
        if (!$client) {
            $response = [
                'success' => false,
                'message' => 'Failed to delete client.'
            ];
    
            return response($response, 400);
        }

        $response = [
            'success' => true,
            'record' => $request->all()
        ];

        return response($response, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $client = Client::destroy($id);

        if (!$client) {
            $response = [
                'success' => false,
                'message' => 'Failed to delete client.'
            ];
    
            return response($response, 400);
        }

        $response = [
            'success' => true,
            'record' => $client
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

        $clients = Client::orderBy('id', 'asc')
            ->with(['creator' => function ($r_query) {
                $r_query->select('id', User::raw("CONCAT(first_name, ' ', last_name) AS full_name"));
            }]);

        if (isset($search)) {
            $clients = $clients->where(function ($query) use ($search) {
                $query->where('name', 'LIKE', '%'. $search . '%')
                    ->orWhere('description', 'LIKE', '%'. $search . '%')
                    ->orWhere('code', 'LIKE', '%'. $search . '%')
                    ->orWhere('code2', 'LIKE', '%'. $search . '%');
            });
        }

        $clientsTotal = $clients->count();
        $clients = $clients->offset(($page - 1) * $limit)
            ->limit($limit)
            ->get();

        $pages = ceil($clientsTotal / $limit);

        $info = (object) ['total_records' => $clientsTotal, 'total_pages' => $pages];

        $response = [
            'success' => true,
            'info' => $info,
            'records' => $clients
        ];

        return response($response, 200);
    }
}
