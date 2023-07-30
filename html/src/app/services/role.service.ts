import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { APP_CONFIG } from '@/app.config';

@Injectable({
    providedIn: 'root'
})
export class RoleService {
  rolesGetAll = new Subject<any>();
  rolePost = new Subject<any>();
  rolePut = new Subject<any>();
  roleDelete = new Subject<any>();
  rolesGetAllPaginate = new Subject<any>();

  constructor(@Inject(APP_CONFIG) private appConfig: any,
    private httpClient: HttpClient) {}

  httpGetAllRoles(params: any = []) {
    let httpParams = new HttpParams();

    for (const param of Object.keys(params)) {
      httpParams = httpParams.append(param, params[param]);
    }

    this.httpClient.get(`${this.appConfig.API_ENDPOINT}/api/roles`, { params: httpParams, observe: 'response' }).subscribe({
      next: (response) => {
        this.rolesGetAll.next(response);
      },
      error: (error) => {
        this.rolesGetAll.next(error);
      }
    });
  }

  httpPostRole(data: any) {
    this.httpClient.post(`${this.appConfig.API_ENDPOINT}/api/roles`, { ...data }, { observe: 'response' }).subscribe({
      next: (response) => {
        this.rolePost.next(response);
      },
      error: (error) => {
        this.rolePost.next(error);
      }
    });
  }

  httpPutRole(id: any, data: any) {
    this.httpClient.put(`${this.appConfig.API_ENDPOINT}/api/roles/${id}`, { ...data }, { observe: 'response' }).subscribe({
      next: (response) => {
        this.rolePut.next(response);
      },
      error: (error) => {
        this.rolePut.next(error);
      }
    });
  }

  httpDeleteRole(id: any) {
    this.httpClient.delete(`${this.appConfig.API_ENDPOINT}/api/roles/${id}`, { observe: 'response' }).subscribe({
      next: (response) => {
        this.roleDelete.next(response);
      },
      error: (error) => {
        this.roleDelete.next(error);
      }
    });
  }
  
  httpGetAllRolesPaginate(params: any = []) {
    let httpParams = new HttpParams();

    for (const param of Object.keys(params)) {
      httpParams = httpParams.append(param, params[param]);
    }

    this.httpClient.get(`${this.appConfig.API_ENDPOINT}/api/roles/paginate`, { params: httpParams, observe: 'response' }).subscribe({
      next: (response) => {
        this.rolesGetAllPaginate.next(response);
      },
      error: (error) => {
        this.rolesGetAllPaginate.next(error);
      }
    });
  }

}
