import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { APP_CONFIG } from '@/app.config';

@Injectable({
    providedIn: 'root'
})
export class UserService {
  usersGetAll = new Subject<any>();
  userPost = new Subject<any>();
  userPut = new Subject<any>();
  userDelete = new Subject<any>();
  usersGetAllPaginate = new Subject<any>();
  userGetMe = new Subject<any>();

  constructor(@Inject(APP_CONFIG) private appConfig: any,
    private httpClient: HttpClient) {}

  httpGetAllUsers(params: any = []) {
    let httpParams = new HttpParams();

    for (const param of Object.keys(params)) {
      httpParams = httpParams.append(param, params[param]);
    }

    this.httpClient.get(`${this.appConfig.API_ENDPOINT}/api/users`, { params: httpParams, observe: 'response' }).subscribe({
      next: (response) => {
        this.usersGetAll.next(response);
      },
      error: (error) => {
        this.usersGetAll.next(error);
      }
    });
  }

  httpPostUser(data: any) {
    this.httpClient.post(`${this.appConfig.API_ENDPOINT}/api/users`, { ...data }, { observe: 'response' }).subscribe({
      next: (response) => {
        this.userPost.next(response);
      },
      error: (error) => {
        this.userPost.next(error);
      }
    });
  }

  httpPutUser(id: any, data: any) {
    this.httpClient.put(`${this.appConfig.API_ENDPOINT}/api/users/${id}`, { ...data }, { observe: 'response' }).subscribe({
      next: (response) => {
        this.userPut.next(response);
      },
      error: (error) => {
        this.userPut.next(error);
      }
    });
  }

  httpDeleteUser(id: any) {
    this.httpClient.delete(`${this.appConfig.API_ENDPOINT}/api/users/${id}`, { observe: 'response' }).subscribe({
      next: (response) => {
        this.userDelete.next(response);
      },
      error: (error) => {
        this.userDelete.next(error);
      }
    });
  }
  
  httpGetAllUsersPaginate(params: any = []) {
    let httpParams = new HttpParams();

    for (const param of Object.keys(params)) {
      httpParams = httpParams.append(param, params[param]);
    }

    this.httpClient.get(`${this.appConfig.API_ENDPOINT}/api/users/paginate`, { params: httpParams, observe: 'response' }).subscribe({
      next: (response) => {
        this.usersGetAllPaginate.next(response);
      },
      error: (error) => {
        this.usersGetAllPaginate.next(error);
      }
    });
  }

  httpGetMeUser() {
    this.httpClient.get(`${this.appConfig.API_ENDPOINT}/api/users/get-me`, { observe: 'response' }).subscribe({
      next: (response) => {
        this.userGetMe.next(response);
      },
      error: (error) => {
        this.userGetMe.next(error);
      }
    });
  }

}
