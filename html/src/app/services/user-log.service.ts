import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { APP_CONFIG } from '@/app.config';

@Injectable({
    providedIn: 'root'
})
export class UserLogService {
  userLogsGetAll = new Subject<any>();
  userLogPost = new Subject<any>();
  userLogPut = new Subject<any>();
  userLogDelete = new Subject<any>();
  userLogsGetAllPaginate = new Subject<any>();

  constructor(@Inject(APP_CONFIG) private appConfig: any,
    private httpClient: HttpClient) {}

  httpGetAllUserLogs(params: any = []) {
    let httpParams = new HttpParams();

    for (const param of Object.keys(params)) {
      httpParams = httpParams.append(param, params[param]);
    }

    this.httpClient.get(`${this.appConfig.API_ENDPOINT}/api/user-logs`, { params: httpParams, observe: 'response' }).subscribe({
      next: (response) => {
        this.userLogsGetAll.next(response);
      },
      error: (error) => {
        this.userLogsGetAll.next(error);
      }
    });
  }

  httpPostUserLog(data: any) {
    this.httpClient.post(`${this.appConfig.API_ENDPOINT}/api/user-logs`, { ...data }, { observe: 'response' }).subscribe({
      next: (response) => {
        this.userLogPost.next(response);
      },
      error: (error) => {
        this.userLogPost.next(error);
      }
    });
  }

  httpPutUserLog(id: any, data: any) {
    this.httpClient.put(`${this.appConfig.API_ENDPOINT}/api/user-logs/${id}`, { ...data }, { observe: 'response' }).subscribe({
      next: (response) => {
        this.userLogPut.next(response);
      },
      error: (error) => {
        this.userLogPut.next(error);
      }
    });
  }

  httpDeleteUserLog(id: any) {
    this.httpClient.delete(`${this.appConfig.API_ENDPOINT}/api/user-logs/${id}`, { observe: 'response' }).subscribe({
      next: (response) => {
        this.userLogDelete.next(response);
      },
      error: (error) => {
        this.userLogDelete.next(error);
      }
    });
  }
  
  httpGetAllUserLogsPaginate(params: any = []) {
    let httpParams = new HttpParams();

    for (const param of Object.keys(params)) {
      httpParams = httpParams.append(param, params[param]);
    }

    this.httpClient.get(`${this.appConfig.API_ENDPOINT}/api/user-logs/paginate`, { params: httpParams, observe: 'response' }).subscribe({
      next: (response) => {
        this.userLogsGetAllPaginate.next(response);
      },
      error: (error) => {
        this.userLogsGetAllPaginate.next(error);
      }
    });
  }

}
