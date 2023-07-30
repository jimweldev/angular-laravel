import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { APP_CONFIG } from '@/app.config';

@Injectable({
    providedIn: 'root'
})
export class MailLogService {
  mailLogsGetAll = new Subject<any>();
  mailLogPost = new Subject<any>();
  mailLogPut = new Subject<any>();
  mailLogDelete = new Subject<any>();
  mailLogsGetAllPaginate = new Subject<any>();

  constructor(@Inject(APP_CONFIG) private appConfig: any,
    private httpClient: HttpClient) {}

  httpGetAllMailLogs(params: any = []) {
    let httpParams = new HttpParams();

    for (const param of Object.keys(params)) {
      httpParams = httpParams.append(param, params[param]);
    }

    this.httpClient.get(`${this.appConfig.API_ENDPOINT}/api/mail-logs`, { params: httpParams, observe: 'response' }).subscribe({
      next: (response) => {
        this.mailLogsGetAll.next(response);
      },
      error: (error) => {
        this.mailLogsGetAll.next(error);
      }
    });
  }

  httpPostMailLog(data: any) {
    this.httpClient.post(`${this.appConfig.API_ENDPOINT}/api/mail-logs`, { ...data }, { observe: 'response' }).subscribe({
      next: (response) => {
        this.mailLogPost.next(response);
      },
      error: (error) => {
        this.mailLogPost.next(error);
      }
    });
  }

  httpPutMailLog(id: any, data: any) {
    this.httpClient.put(`${this.appConfig.API_ENDPOINT}/api/mail-logs/${id}`, { ...data }, { observe: 'response' }).subscribe({
      next: (response) => {
        this.mailLogPut.next(response);
      },
      error: (error) => {
        this.mailLogPut.next(error);
      }
    });
  }

  httpDeleteMailLog(id: any) {
    this.httpClient.delete(`${this.appConfig.API_ENDPOINT}/api/mail-logs/${id}`, { observe: 'response' }).subscribe({
      next: (response) => {
        this.mailLogDelete.next(response);
      },
      error: (error) => {
        this.mailLogDelete.next(error);
      }
    });
  }
  
  httpGetAllMailLogsPaginate(params: any = []) {
    let httpParams = new HttpParams();

    for (const param of Object.keys(params)) {
      httpParams = httpParams.append(param, params[param]);
    }

    this.httpClient.get(`${this.appConfig.API_ENDPOINT}/api/mail-logs/paginate`, { params: httpParams, observe: 'response' }).subscribe({
      next: (response) => {
        this.mailLogsGetAllPaginate.next(response);
      },
      error: (error) => {
        this.mailLogsGetAllPaginate.next(error);
      }
    });
  }

}
