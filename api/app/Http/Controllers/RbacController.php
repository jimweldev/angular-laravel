<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Role;
use App\Models\UserRole;
use App\Models\RolePermission;
use App\Models\Permission;

class RbacController extends Controller
{
    public static function isAllowed($permissionName, $user)
    {
        // get all user role id of user
        $user_role_ids = UserRole::where('user_id', $user->id)->pluck("role_id")->toArray();

        // get all the roles of user
        $user_roles = Role::whereIn('id', $user_role_ids)->get();

        // loop the roles of user
        foreach ($user_roles as $user_role) {
            // check the permissions of the role
            $role_permissions = RolePermission::where('role_id', $user_role->id)->get();

            // loop the role permission
            foreach ($role_permissions as $role_permission) {
                $permission = Permission::where('id', $role_permission->permission_id)
                    ->where('name', $permissionName)
                    ->first();

                // return $permission ? true : false;
                if ($permission) {
                    return true;
                }
            }
        }

        return false;
    }
}
