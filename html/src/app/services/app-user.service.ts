import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { APP_CONFIG } from '@/app.config';

@Injectable({
    providedIn: 'root'
})
export class AppUserService {
  appUsersGetAll = new Subject<any>();
  appUserPost = new Subject<any>();
  appUserPut = new Subject<any>();
  appUserDelete = new Subject<any>();
  appUsersGetAllPaginate = new Subject<any>();

  constructor(@Inject(APP_CONFIG) private appConfig: any,
    private httpClient: HttpClient) {}

  httpGetAllAppUsers(params: any = []) {
    let httpParams = new HttpParams();

    for (const param of Object.keys(params)) {
      httpParams = httpParams.append(param, params[param]);
    }

    this.httpClient.get(`${this.appConfig.API_ENDPOINT}/api/app-users`, { params: httpParams, observe: 'response' }).subscribe({
      next: (response) => {
        this.appUsersGetAll.next(response);
      },
      error: (error) => {
        this.appUsersGetAll.next(error);
      }
    });
  }

  httpPostAppUser(data: any) {
    this.httpClient.post(`${this.appConfig.API_ENDPOINT}/api/app-users`, { ...data }, { observe: 'response' }).subscribe({
      next: (response) => {
        this.appUserPost.next(response);
      },
      error: (error) => {
        this.appUserPost.next(error);
      }
    });
  }

  httpPutAppUser(id: any, data: any) {
    this.httpClient.put(`${this.appConfig.API_ENDPOINT}/api/app-users/${id}`, { ...data }, { observe: 'response' }).subscribe({
      next: (response) => {
        this.appUserPut.next(response);
      },
      error: (error) => {
        this.appUserPut.next(error);
      }
    });
  }

  httpDeleteAppUser(id: any) {
    this.httpClient.delete(`${this.appConfig.API_ENDPOINT}/api/app-users/${id}`, { observe: 'response' }).subscribe({
      next: (response) => {
        this.appUserDelete.next(response);
      },
      error: (error) => {
        this.appUserDelete.next(error);
      }
    });
  }
  
  httpGetAllAppUsersPaginate(params: any = []) {
    let httpParams = new HttpParams();

    for (const param of Object.keys(params)) {
      httpParams = httpParams.append(param, params[param]);
    }

    this.httpClient.get(`${this.appConfig.API_ENDPOINT}/api/app-users/paginate`, { params: httpParams, observe: 'response' }).subscribe({
      next: (response) => {
        this.appUsersGetAllPaginate.next(response);
      },
      error: (error) => {
        this.appUsersGetAllPaginate.next(error);
      }
    });
  }

}
