import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { APP_CONFIG } from '@/app.config';

@Injectable({
    providedIn: 'root'
})
export class SystemLogService {
  systemLogsGetAll = new Subject<any>();
  systemLogPost = new Subject<any>();
  systemLogPut = new Subject<any>();
  systemLogDelete = new Subject<any>();
  systemLogsGetAllPaginate = new Subject<any>();

  constructor(@Inject(APP_CONFIG) private appConfig: any,
    private httpClient: HttpClient) {}

  httpGetAllSystemLogs(params: any = []) {
    let httpParams = new HttpParams();

    for (const param of Object.keys(params)) {
      httpParams = httpParams.append(param, params[param]);
    }

    this.httpClient.get(`${this.appConfig.API_ENDPOINT}/api/system-logs`, { params: httpParams, observe: 'response' }).subscribe({
      next: (response) => {
        this.systemLogsGetAll.next(response);
      },
      error: (error) => {
        this.systemLogsGetAll.next(error);
      }
    });
  }

  httpPostSystemLog(data: any) {
    this.httpClient.post(`${this.appConfig.API_ENDPOINT}/api/system-logs`, { ...data }, { observe: 'response' }).subscribe({
      next: (response) => {
        this.systemLogPost.next(response);
      },
      error: (error) => {
        this.systemLogPost.next(error);
      }
    });
  }

  httpPutSystemLog(id: any, data: any) {
    this.httpClient.put(`${this.appConfig.API_ENDPOINT}/api/system-logs/${id}`, { ...data }, { observe: 'response' }).subscribe({
      next: (response) => {
        this.systemLogPut.next(response);
      },
      error: (error) => {
        this.systemLogPut.next(error);
      }
    });
  }

  httpDeleteSystemLog(id: any) {
    this.httpClient.delete(`${this.appConfig.API_ENDPOINT}/api/system-logs/${id}`, { observe: 'response' }).subscribe({
      next: (response) => {
        this.systemLogDelete.next(response);
      },
      error: (error) => {
        this.systemLogDelete.next(error);
      }
    });
  }
  
  httpGetAllSystemLogsPaginate(params: any = []) {
    let httpParams = new HttpParams();

    for (const param of Object.keys(params)) {
      httpParams = httpParams.append(param, params[param]);
    }

    this.httpClient.get(`${this.appConfig.API_ENDPOINT}/api/system-logs/paginate`, { params: httpParams, observe: 'response' }).subscribe({
      next: (response) => {
        this.systemLogsGetAllPaginate.next(response);
      },
      error: (error) => {
        this.systemLogsGetAllPaginate.next(error);
      }
    });
  }

}
