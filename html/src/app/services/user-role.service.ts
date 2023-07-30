import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { APP_CONFIG } from '@/app.config';

@Injectable({
    providedIn: 'root'
})
export class UserRoleService {
  userRolesGetAll = new Subject<any>();
  userRolePost = new Subject<any>();
  userRolePut = new Subject<any>();
  userRoleDelete = new Subject<any>();
  userRolesGetAllPaginate = new Subject<any>();

  constructor(@Inject(APP_CONFIG) private appConfig: any,
    private httpClient: HttpClient) {}

  httpGetAllUserRoles(params: any = []) {
    let httpParams = new HttpParams();

    for (const param of Object.keys(params)) {
      httpParams = httpParams.append(param, params[param]);
    }

    this.httpClient.get(`${this.appConfig.API_ENDPOINT}/api/user-roles`, { params: httpParams, observe: 'response' }).subscribe({
      next: (response) => {
        this.userRolesGetAll.next(response);
      },
      error: (error) => {
        this.userRolesGetAll.next(error);
      }
    });
  }

  httpPostUserRole(data: any) {
    this.httpClient.post(`${this.appConfig.API_ENDPOINT}/api/user-roles`, { ...data }, { observe: 'response' }).subscribe({
      next: (response) => {
        this.userRolePost.next(response);
      },
      error: (error) => {
        this.userRolePost.next(error);
      }
    });
  }

  httpPutUserRole(id: any, data: any) {
    this.httpClient.put(`${this.appConfig.API_ENDPOINT}/api/user-roles/${id}`, { ...data }, { observe: 'response' }).subscribe({
      next: (response) => {
        this.userRolePut.next(response);
      },
      error: (error) => {
        this.userRolePut.next(error);
      }
    });
  }

  httpDeleteUserRole(id: any) {
    this.httpClient.delete(`${this.appConfig.API_ENDPOINT}/api/user-roles/${id}`, { observe: 'response' }).subscribe({
      next: (response) => {
        this.userRoleDelete.next(response);
      },
      error: (error) => {
        this.userRoleDelete.next(error);
      }
    });
  }
  
  httpGetAllUserRolesPaginate(params: any = []) {
    let httpParams = new HttpParams();

    for (const param of Object.keys(params)) {
      httpParams = httpParams.append(param, params[param]);
    }

    this.httpClient.get(`${this.appConfig.API_ENDPOINT}/api/user-roles/paginate`, { params: httpParams, observe: 'response' }).subscribe({
      next: (response) => {
        this.userRolesGetAllPaginate.next(response);
      },
      error: (error) => {
        this.userRolesGetAllPaginate.next(error);
      }
    });
  }

}
