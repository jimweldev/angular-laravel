import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { APP_CONFIG } from '@/app.config';

@Injectable({
    providedIn: 'root'
})
export class PermissionService {
  permissionsGetAll = new Subject<any>();
  permissionPost = new Subject<any>();
  permissionPut = new Subject<any>();
  permissionDelete = new Subject<any>();
  permissionsGetAllPaginate = new Subject<any>();

  constructor(@Inject(APP_CONFIG) private appConfig: any,
    private httpClient: HttpClient) {}

  httpGetAllPermissions(params: any = []) {
    let httpParams = new HttpParams();

    for (const param of Object.keys(params)) {
      httpParams = httpParams.append(param, params[param]);
    }

    this.httpClient.get(`${this.appConfig.API_ENDPOINT}/api/permissions`, { params: httpParams, observe: 'response' }).subscribe({
      next: (response) => {
        this.permissionsGetAll.next(response);
      },
      error: (error) => {
        this.permissionsGetAll.next(error);
      }
    });
  }

  httpPostPermission(data: any) {
    this.httpClient.post(`${this.appConfig.API_ENDPOINT}/api/permissions`, { ...data }, { observe: 'response' }).subscribe({
      next: (response) => {
        this.permissionPost.next(response);
      },
      error: (error) => {
        this.permissionPost.next(error);
      }
    });
  }

  httpPutPermission(id: any, data: any) {
    this.httpClient.put(`${this.appConfig.API_ENDPOINT}/api/permissions/${id}`, { ...data }, { observe: 'response' }).subscribe({
      next: (response) => {
        this.permissionPut.next(response);
      },
      error: (error) => {
        this.permissionPut.next(error);
      }
    });
  }

  httpDeletePermission(id: any) {
    this.httpClient.delete(`${this.appConfig.API_ENDPOINT}/api/permissions/${id}`, { observe: 'response' }).subscribe({
      next: (response) => {
        this.permissionDelete.next(response);
      },
      error: (error) => {
        this.permissionDelete.next(error);
      }
    });
  }
  
  httpGetAllPermissionsPaginate(params: any = []) {
    let httpParams = new HttpParams();

    for (const param of Object.keys(params)) {
      httpParams = httpParams.append(param, params[param]);
    }

    this.httpClient.get(`${this.appConfig.API_ENDPOINT}/api/permissions/paginate`, { params: httpParams, observe: 'response' }).subscribe({
      next: (response) => {
        this.permissionsGetAllPaginate.next(response);
      },
      error: (error) => {
        this.permissionsGetAllPaginate.next(error);
      }
    });
  }

}
