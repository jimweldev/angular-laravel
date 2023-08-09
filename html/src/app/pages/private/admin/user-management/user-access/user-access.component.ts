import { Component, OnInit, OnDestroy, Injectable, Inject } from '@angular/core';
import { APP_CONFIG } from '@/app.config';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '@services/user.service';
import { UserRoleService } from '@services/user-role.service';
import { RoleService } from '@services/role.service';
import { PermissionService } from '@services/permission.service';
import { RolePermissionService } from '@services/role-permission.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-user-access',
  templateUrl: './user-access.component.html',
  styleUrls: ['./user-access.component.scss']
})

@Injectable()
export class UserAccessComponent implements OnInit, OnDestroy {
  timeoutId: any = null;

  userRolePostForm: FormGroup = this.formBuilder.group({
    user_id: [null, Validators.required],
    role_id: [null, Validators.required],
  });

  userRolePutForm: FormGroup = this.formBuilder.group({
    id: ['', Validators.required],
    user_id: [null, Validators.required],
    role_id: [null, Validators.required],
  });

  rolePostForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
  });

  rolePutForm: FormGroup = this.formBuilder.group({
    id: ['', Validators.required],
    name: ['', Validators.required],
  });

  rolePermissionPostForm: FormGroup = this.formBuilder.group({
    role_id: ['', Validators.required],
    name: ['', Validators.required],
    permission_ids: [null, Validators.required],
  });

  permissionPostForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    controller: ['', Validators.required],
    function_name: ['', Validators.required],
  });

  permissionPutForm: FormGroup = this.formBuilder.group({
    id: ['', Validators.required],
    name: ['', Validators.required],
    controller: ['', Validators.required],
    function_name: ['', Validators.required],
  });

  userList: any = {
    records: [],
    isLoading: false
  };

  roleList: any = {
    records: [],
    isLoading: false,
    value: null
  };

  rolePermissionList: any = {
    records: [],
    isLoading: false,
    value: null
  };

  permissionList: any = {
    records: [],
    isLoading: false,
    value: null
  };

  userRolesPaginate: any = {
    isGetLoading: false,
    isPostLoading: false,
    isPutLoading: false,
    isDeleteLoading: false,
    search: '',
    page: 1,
    limit: 10,
    pages: [],
    records: [],
    totalPages: 0,
    totalRecords: 0,
  };

  rolesPaginate: any = {
    isGetLoading: false,
    isPostLoading: false,
    isPutLoading: false,
    isDeleteLoading: false,
    search: '',
    page: 1,
    limit: 10,
    pages: [],
    records: [],
    totalPages: 0,
    totalRecords: 0,
  };

  permissionsPaginate: any = {
    isGetLoading: false,
    isPostLoading: false,
    isPutLoading: false,
    isDeleteLoading: false,
    search: '',
    page: 1,
    limit: 10,
    pages: [],
    records: [],
    totalPages: 0,
    totalRecords: 0,
  };

  constructor(@Inject(APP_CONFIG) private appConfig: any,
    private titleService: Title,
    private formBuilder : FormBuilder,
    private userService: UserService,
    private userRoleService: UserRoleService,
    private roleService: RoleService,
    private rolePermissionService: RolePermissionService,
    private permissionService: PermissionService) { }

  ngOnInit(): void {
    this.titleService.setTitle(`User Access | ${this.appConfig.APP_NAME}`);

    this.onRefresh('userList');
    this.onRefresh('roleList');
    this.onRefresh('permissionList');
    this.onRefresh('userRolesPaginate');
    this.onRefresh('rolesPaginate');
    this.onRefresh('permissionsPaginate');
  }

  onRefresh(type: string) {
    if (type === 'userList') {
      this.userList.isLoading = true;

      this.userService.httpGetAllUsers();
    } else if (type === 'roleList') {
      this.roleList.isLoading = true;

      this.roleService.httpGetAllRoles();
    } else if (type === 'permissionList') {
      this.permissionList.isLoading = true;

      this.permissionService.httpGetAllPermissions();
    } else if (type === 'userRolesPaginate') {
      this.userRolesPaginate.isGetLoading = true;

      const data = { 
        search: this.userRolesPaginate.search,
        page: this.userRolesPaginate.page,
        limit: this.userRolesPaginate.limit 
      }

      this.userRoleService.httpGetAllUserRolesPaginate(data);
    } else if (type === 'rolesPaginate') {
      this.rolesPaginate.isGetLoading = true;
      
      const data = { 
        search: this.rolesPaginate.search,
        page: this.rolesPaginate.page,
        limit: this.rolesPaginate.limit 
      }

      this.roleService.httpGetAllRolesPaginate(data);
    } else if (type === 'permissionsPaginate') {
      this.permissionsPaginate.isGetLoading = true;
      
      const data = { 
        search: this.permissionsPaginate.search,
        page: this.permissionsPaginate.page,
        limit: this.permissionsPaginate.limit 
      }

      this.permissionService.httpGetAllPermissionsPaginate(data);
    }
  }

  onSubmit(type: string) {
    if (type === 'userRoles') {
      if (this.userRolePostForm.valid) {
        this.userRolesPaginate.isPostLoading = true;
        this.userRoleService.httpPostUserRole(this.userRolePostForm.value);
      }
    } else if (type === 'roles') {
      if (this.rolePostForm.valid) {
        this.rolesPaginate.isPostLoading = true;
        this.roleService.httpPostRole(this.rolePostForm.value);
      }
    } else if (type === 'rolePermissions') {
      if (this.rolePermissionPostForm.valid) {
        this.rolePermissionList.isLoading = true;
        this.rolePermissionService.httpPostRolePermission(this.rolePermissionPostForm.value);
      }
    } else if (type === 'permissions') {
      if (this.permissionPostForm.valid) {
        this.permissionsPaginate.isPostLoading = true;
        this.permissionService.httpPostPermission(this.permissionPostForm.value);
      }
    }
  }

  onEdit(type: string, data: any) {
    if (type === 'userRoles') {
      this.userRolePutForm.controls['id'].setValue(data.id);
      this.userRolePutForm.controls['user_id'].setValue(parseInt(data.user_id));
      this.userRolePutForm.controls['role_id'].setValue(parseInt(data.role_id));
    } else if (type === 'roles') {
      this.rolePutForm.controls['id'].setValue(data.id);
      this.rolePutForm.controls['name'].setValue(data.name);
    } else if (type === 'rolePermissions') {
      this.rolePermissionPostForm.controls['role_id'].setValue(data.id);
      this.rolePermissionPostForm.controls['name'].setValue(data.name);

      this.rolePermissionService.httpGetAllRolePermissions({ role_id: data.id });
    } else if (type === 'permissions') {
      this.permissionPutForm.controls['id'].setValue(data.id);
      this.permissionPutForm.controls['name'].setValue(data.name);
      this.permissionPutForm.controls['controller'].setValue(data.controller);
      this.permissionPutForm.controls['function_name'].setValue(data.function_name);
    }
  }

  onUpdate(type: string) {
    if (type === 'userRoles') {
      if (this.userRolePutForm.valid) {
        this.userRolesPaginate.isPutLoading = true;

        const { id, ...newValues } = this.userRolePutForm.value;
        
        this.userRoleService.httpPutUserRole(id, newValues);
      }
    } else if (type === 'roles') {
      if (this.rolePutForm.valid) {
        this.rolesPaginate.isPutLoading = true;

        const { id, ...newValues } = this.rolePutForm.value;
        
        this.roleService.httpPutRole(id, newValues);
      }
    } else if (type === 'permissions') {
      if (this.permissionPutForm.valid) {
        this.permissionsPaginate.isPutLoading = true;

        const { id, ...newValues } = this.permissionPutForm.value;
        
        this.permissionService.httpPutPermission(id, newValues);
      }
    }
  }

  onDelete(type: string, data: any) {
    if (type === 'userRoles') {
      Swal.fire({
        html: `<p>Are you sure you want to delete <b>${data.role.name}</b>?</p>
        <p><b>[${data.user.first_name} ${data.user.last_name}]</b></p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        confirmButtonColor: '#DC3545',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.userRolesPaginate.isDeleteLoading = true;

          this.userRoleService.httpDeleteUserRole(data.id);
        }
      })
    } else if (type === 'roles') {
      Swal.fire({
        html: `<p>Are you sure you want to delete <b>${data.name}</b>?</p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        confirmButtonColor: '#DC3545',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.rolesPaginate.isDeleteLoading = true;

          this.roleService.httpDeleteRole(data.id);
        }
      })
    } else if (type === 'rolePermissions') {
      Swal.fire({
        html: `<p>Are you sure you want to delete <b>${data.permission.name}</b>?</p>
        <p><b>[${data.role.name}]</b></p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        confirmButtonColor: '#DC3545',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.rolePermissionList.isLoading = true;
          this.rolePermissionService.httpDeleteRolePermission(data.id);
        }
      })
    } else if (type === 'permissions') {
      Swal.fire({
        html: `<p>Are you sure you want to delete <b>${data.name}</b>?</p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        confirmButtonColor: '#DC3545',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.permissionsPaginate.isDeleteLoading = true;

          this.permissionService.httpDeletePermission(data.id);
        }
      })
    }
  }

  onInputSearch(type: string) {
    if (type === 'userRolesPaginate') {
      this.debounce(() => {
        this.userRolesPaginate.page = 1;

        this.onRefresh("userRolesPaginate");
      }, 200);
    } else if (type === 'rolesPaginate') {
      this.debounce(() => {
        this.rolesPaginate.page = 1;

        this.onRefresh("rolesPaginate");
      }, 200);
    } else if (type === 'permissionsPaginate') {
      this.debounce(() => {
        this.permissionsPaginate.page = 1;

        this.onRefresh("permissionsPaginate");
      }, 200);
    }
  }

  debounce(callback: any, timeout: number) {
    clearTimeout(this.timeoutId);

    this.timeoutId = setTimeout(() => callback(), timeout);
  }

  // SUBSCRIPTIONS
  // users
  usersGetAllSubscription = this.userService.usersGetAll.subscribe(
    (response: any) => {
      if (response.ok) {
        this.userList.records = response.body.records;
      } else {
        Swal.fire({
          title: 'Error!',
          text: response.error.message,
          icon: 'error',
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
        });
      }

      this.userList.isLoading = false;
    }
  );
  
  // user roles
  userRolesGetAllPaginateSubscription = this.userRoleService.userRolesGetAllPaginate.subscribe(
    (response: any) => {
      if (response.ok) {
        this.userRolesPaginate.records = response.body.records;
        this.userRolesPaginate.totalPages = response.body.info.total_pages;
        this.userRolesPaginate.totalRecords = response.body.info.total_records;
      } else {
        Swal.fire({
          title: 'Error!',
          text: response.error.message,
          icon: 'error',
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
        });
      }

      this.userRolesPaginate.isGetLoading = false;
    }
  );

  userRolePostSubscription = this.userRoleService.userRolePost.subscribe(
    (response: any) => {
      if (response.ok) {
        this.userRolePostForm.reset();

        this.onRefresh('userRolesPaginate');

        Swal.fire({
          title: 'Success!',
          text: 'Successfully created user role.',
          icon: 'success',
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: response.error.message,
          icon: 'error',
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
        });
      }

      this.userRolesPaginate.isPostLoading = false;
    }
  );

  userRolePutSubscription = this.userRoleService.userRolePut.subscribe(
    (response: any) => {
      if (response.ok) {
        this.onRefresh('userRolesPaginate');

        Swal.fire({
          title: 'Success!',
          text: 'Successfully updated user role.',
          icon: 'success',
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: response.error.message,
          icon: 'error',
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
        });
      }

      this.userRolesPaginate.isPutLoading = false;
    }
  );

  userRoleDeleteSubscription = this.userRoleService.userRoleDelete.subscribe(
    (response: any) => {
      if (response.ok) {
        this.onRefresh('userRolesPaginate');

        Swal.fire({
          title: 'Success!',
          text: 'Successfully deleted user role.',
          icon: 'success',
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: response.error.message,
          icon: 'error',
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
        });
      }

      this.userRolesPaginate.isDeleteLoading = false;
    }
  );

  // roles
  rolesGetAllPaginateSubscription = this.roleService.rolesGetAllPaginate.subscribe(
    (response: any) => {
      if (response.ok) {
        this.rolesPaginate.records = response.body.records;
        this.rolesPaginate.totalPages = response.body.info.total_pages;
        this.rolesPaginate.totalRecords = response.body.info.total_records;
      } else {
        Swal.fire({
          title: 'Error!',
          text: response.error.message,
          icon: 'error',
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
        });
      }

      this.rolesPaginate.isGetLoading = false;
    }
  );

  rolesGetAllSubscription = this.roleService.rolesGetAll.subscribe(
    (response: any) => {
      if (response.ok) {
        this.roleList.records = response.body.records;
      } else {
        Swal.fire({
          title: 'Error!',
          text: response.error.message,
          icon: 'error',
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
        });
      }

      this.roleList.isLoading = false;
    }
  );

  rolePostSubscription = this.roleService.rolePost.subscribe(
    (response: any) => {
      if (response.ok) {
        this.rolePostForm.reset();

        this.onRefresh('rolesPaginate');

        Swal.fire({
          title: 'Success!',
          text: 'Successfully created role.',
          icon: 'success',
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: response.error.message,
          icon: 'error',
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
        });
      }

      this.rolesPaginate.isPostLoading = false;
    }
  );

  rolePutSubscription = this.roleService.rolePut.subscribe(
    (response: any) => {
      if (response.ok) {
        this.onRefresh('rolesPaginate');
        this.onRefresh('roleList');

        Swal.fire({
          title: 'Success!',
          text: 'Successfully updated role.',
          icon: 'success',
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: response.error.message,
          icon: 'error',
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
        });
      }

      this.rolesPaginate.isPutLoading = false;
    }
  );

  roleDeleteSubscription = this.roleService.roleDelete.subscribe(
    (response: any) => {
      if (response.ok) {
        this.onRefresh('rolesPaginate');
        this.onRefresh('roleList');

        Swal.fire({
          title: 'Success!',
          text: 'Successfully deleted role.',
          icon: 'success',
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: response.error.message,
          icon: 'error',
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
        });
      }

      this.rolesPaginate.isDeleteLoading = false;
    }
  );

  // role permissions
  rolePermissionsGetAllSubscription = this.rolePermissionService.rolePermissionsGetAll.subscribe(
    (response: any) => {
      if (response.ok) {
        this.rolePermissionList.records = response.body.records;
      } else {
        Swal.fire({
          title: 'Error!',
          text: response.error.message,
          icon: 'error',
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
        });
      }

      this.rolePermissionList.isLoading = false;
    }
  );

  rolePermissionPostSubscription = this.rolePermissionService.rolePermissionPost.subscribe(
    (response: any) => {
      if (response.ok) {
        this.rolePermissionService.httpGetAllRolePermissions({ role_id: response.body.record.role_id });

        Swal.fire({
          title: 'Success!',
          text: 'Successfully created role permissions.',
          icon: 'success',
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: response.error.message,
          icon: 'error',
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
        });
      }
    }
  );

  rolePermissionDeleteSubscription = this.rolePermissionService.rolePermissionDelete.subscribe(
    (response: any) => {
      if (response.ok) {
        this.rolePermissionList.isLoading = true;
        this.rolePermissionService.httpGetAllRolePermissions({ role_id: response.body.record.role_id });

        Swal.fire({
          title: 'Success!',
          text: 'Successfully deleted role.',
          icon: 'success',
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: response.error.message,
          icon: 'error',
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
        });
      }
    }
  );

  // permissions
  permissionsGetAllPaginateSubscription = this.permissionService.permissionsGetAllPaginate.subscribe(
    (response: any) => {
      if (response.ok) {
        this.permissionsPaginate.records = response.body.records;
        this.permissionsPaginate.totalPages = response.body.info.total_pages;
        this.permissionsPaginate.totalRecords = response.body.info.total_records;
      } else {
        Swal.fire({
          title: 'Error!',
          text: response.error.message,
          icon: 'error',
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
        });
      }

      this.permissionsPaginate.isGetLoading = false;
    }
  );

  permissionsGetAllSubscription = this.permissionService.permissionsGetAll.subscribe(
    (response: any) => {
      if (response.ok) {
        this.permissionList.records = response.body.records;
      } else {
        Swal.fire({
          title: 'Error!',
          text: response.error.message,
          icon: 'error',
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
        });
      }

      this.permissionList.isLoading = false;
    }
  );

  permissionPostSubscription = this.permissionService.permissionPost.subscribe(
    (response: any) => {
      if (response.ok) {
        this.permissionPostForm.reset();

        this.onRefresh('permissionsPaginate');

        Swal.fire({
          title: 'Success!',
          text: 'Successfully created permission.',
          icon: 'success',
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: response.error.message,
          icon: 'error',
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
        });
      }

      this.permissionsPaginate.isPostLoading = false;
    }
  );

  permissionPutSubscription = this.permissionService.permissionPut.subscribe(
    (response: any) => {
      if (response.ok) {
        this.onRefresh('permissionsPaginate');
        this.onRefresh('permissionList');

        Swal.fire({
          title: 'Success!',
          text: 'Successfully updated permission.',
          icon: 'success',
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: response.error.message,
          icon: 'error',
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
        });
      }

      this.permissionsPaginate.isPutLoading = false;
    }
  );

  permissionDeleteSubscription = this.permissionService.permissionDelete.subscribe(
    (response: any) => {
      if (response.ok) {
        this.onRefresh('permissionsPaginate');
        this.onRefresh('permissionList');

        Swal.fire({
          title: 'Success!',
          text: 'Successfully deleted permission.',
          icon: 'success',
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: response.error.message,
          icon: 'error',
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
        });
      }

      this.permissionsPaginate.isDeleteLoading = false;
    }
  );

  ngOnDestroy(): void {
    // users
    this.usersGetAllSubscription.unsubscribe();

    // user roles
    this.userRolesGetAllPaginateSubscription.unsubscribe();
    this.userRolePostSubscription.unsubscribe();
    this.userRolePutSubscription.unsubscribe();
    this.userRoleDeleteSubscription.unsubscribe();

    // roles
    this.rolesGetAllPaginateSubscription.unsubscribe();
    this.rolesGetAllSubscription.unsubscribe();
    this.rolePostSubscription.unsubscribe();
    this.rolePutSubscription.unsubscribe();
    this.roleDeleteSubscription.unsubscribe();
    
    // role permissions
    this.rolePermissionsGetAllSubscription.unsubscribe();
    this.rolePermissionPostSubscription.unsubscribe();
    this.rolePermissionDeleteSubscription.unsubscribe();

    // permissions
    this.permissionsGetAllPaginateSubscription.unsubscribe();
    this.permissionsGetAllSubscription.unsubscribe();
    this.permissionPostSubscription.unsubscribe();
    this.permissionPutSubscription.unsubscribe();
    this.permissionDeleteSubscription.unsubscribe();
  }
}
