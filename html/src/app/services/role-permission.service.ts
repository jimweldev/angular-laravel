import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { APP_CONFIG } from '@/app.config';

@Injectable({
    providedIn: 'root'
})
export class RolePermissionService {
  rolePermissionsGetAll = new Subject<any>();
  rolePermissionPost = new Subject<any>();
  rolePermissionPut = new Subject<any>();
  rolePermissionDelete = new Subject<any>();
  rolePermissionsGetAllPaginate = new Subject<any>();

  constructor(@Inject(APP_CONFIG) private appConfig: any,
    private httpClient: HttpClient) {}

  httpGetAllRolePermissions(params: any = []) {
    let httpParams = new HttpParams();

    for (const param of Object.keys(params)) {
      httpParams = httpParams.append(param, params[param]);
    }

    this.httpClient.get(`${this.appConfig.API_ENDPOINT}/api/role-permissions`, { params: httpParams, observe: 'response' }).subscribe({
      next: (response) => {
        this.rolePermissionsGetAll.next(response);
      },
      error: (error) => {
        this.rolePermissionsGetAll.next(error);
      }
    });
  }

  httpPostRolePermission(data: any) {
    this.httpClient.post(`${this.appConfig.API_ENDPOINT}/api/role-permissions`, { ...data }, { observe: 'response' }).subscribe({
      next: (response) => {
        this.rolePermissionPost.next(response);
      },
      error: (error) => {
        this.rolePermissionPost.next(error);
      }
    });
  }

  httpPutRolePermission(id: any, data: any) {
    this.httpClient.put(`${this.appConfig.API_ENDPOINT}/api/role-permissions/${id}`, { ...data }, { observe: 'response' }).subscribe({
      next: (response) => {
        this.rolePermissionPut.next(response);
      },
      error: (error) => {
        this.rolePermissionPut.next(error);
      }
    });
  }

  httpDeleteRolePermission(id: any) {
    this.httpClient.delete(`${this.appConfig.API_ENDPOINT}/api/role-permissions/${id}`, { observe: 'response' }).subscribe({
      next: (response) => {
        this.rolePermissionDelete.next(response);
      },
      error: (error) => {
        this.rolePermissionDelete.next(error);
      }
    });
  }
  
  httpGetAllRolePermissionsPaginate(params: any = []) {
    let httpParams = new HttpParams();

    for (const param of Object.keys(params)) {
      httpParams = httpParams.append(param, params[param]);
    }

    this.httpClient.get(`${this.appConfig.API_ENDPOINT}/api/role-permissions/paginate`, { params: httpParams, observe: 'response' }).subscribe({
      next: (response) => {
        this.rolePermissionsGetAllPaginate.next(response);
      },
      error: (error) => {
        this.rolePermissionsGetAllPaginate.next(error);
      }
    });
  }

}
