<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\UserRoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SystemSettingsController;
use App\Http\Controllers\SystemDropdownsController;
use App\Http\Controllers\AppUsersController;
use App\Http\Controllers\UserLogsController;
use App\Http\Controllers\MailLogsController;
use App\Http\Controllers\SystemLogsController;
use App\Http\Controllers\UiRoleMappingController;
use App\Http\Controllers\ClientController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::get('/clients', [ClientController::class, 'index']);
// Route::post('/clients', [ClientController::class, 'store']);
// Route::resource('clients', ClientController::class);

// PUBLIC ROUTES
// Auth
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/auth/getuser', [AuthController::class, 'getuser']);

// PROTECTED ROUTES
Route::group(['middleware' => ['auth:sanctum']], function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // User
    Route::get('/users/rbac-test', [UserController::class, 'rbac_test']);
    Route::get('/users/get-me', [UserController::class, 'get_me']);
    Route::get('/users/paginate', [UserController::class, 'paginate']);
    Route::resource('/users', UserController::class);

    // Permissions
    Route::get('/permissions/paginate', [PermissionController::class, 'paginate']);
    Route::resource('/permissions', PermissionController::class);

    // Roles
    Route::get('/roles/paginate', [RoleController::class, 'paginate']);
    Route::resource('/roles', RoleController::class);

    // Role Permissions
    Route::resource('/role-permissions', RolePermissionController::class);

    // User Roles
    Route::get('/user-roles/paginate', [UserRoleController::class, 'paginate']);
    Route::resource('/user-roles', UserRoleController::class);

    // UI Role Mapping
    Route::get('/ui-role-mappings/paginate', [UiRoleMappingController::class, 'paginate']);
    Route::resource('/ui-role-mappings', UiRoleMappingController::class);

    // System Settings
    Route::get('/system-settings/paginate', [SystemSettingsController::class, 'paginate']);
    Route::resource('/system-settings', SystemSettingsController::class);

    // System Dropdowns
    Route::get('/system-dropdowns/paginate', [SystemDropdownsController::class, 'paginate']);
    Route::resource('/system-dropdowns', SystemDropdownsController::class);

    // App Users
    Route::get('/app-users/paginate', [AppUsersController::class, 'paginate']);
    Route::resource('/app-users', AppUsersController::class);

    // User Logs
    Route::get('/user-logs/paginate', [UserLogsController::class, 'paginate']);
    Route::resource('/user-logs', UserLogsController::class);

    // Mail logs
    Route::get('/mail-logs/paginate', [MailLogsController::class, 'paginate']);
    Route::resource('/mail-logs', MailLogsController::class);

    // System logs
    Route::get('/system-logs/paginate', [SystemLogsController::class, 'paginate']);
    Route::resource('/system-logs', SystemLogsController::class);
    
    // Clients
    Route::get('/clients/paginate', [ClientController::class, 'paginate']);
    Route::resource('/clients', ClientController::class);

});
