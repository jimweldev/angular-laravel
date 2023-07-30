import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { APP_CONFIG } from '@/app.config';

@Injectable({
    providedIn: 'root'
})
export class SystemSettingService {
  systemSettingsGetAll = new Subject<any>();
  systemSettingPost = new Subject<any>();
  systemSettingPut = new Subject<any>();
  systemSettingDelete = new Subject<any>();
  systemSettingsGetAllPaginate = new Subject<any>();

  constructor(@Inject(APP_CONFIG) private appConfig: any,
    private httpClient: HttpClient) {}

  httpGetAllSystemSettings(params: any = []) {
    let httpParams = new HttpParams();

    for (const param of Object.keys(params)) {
      httpParams = httpParams.append(param, params[param]);
    }

    this.httpClient.get(`${this.appConfig.API_ENDPOINT}/api/system-settings`, { params: httpParams, observe: 'response' }).subscribe({
      next: (response) => {
        this.systemSettingsGetAll.next(response);
      },
      error: (error) => {
        this.systemSettingsGetAll.next(error);
      }
    });
  }

  httpPostSystemSetting(data: any) {
    this.httpClient.post(`${this.appConfig.API_ENDPOINT}/api/system-settings`, { ...data }, { observe: 'response' }).subscribe({
      next: (response) => {
        this.systemSettingPost.next(response);
      },
      error: (error) => {
        this.systemSettingPost.next(error);
      }
    });
  }

  httpPutSystemSetting(id: any, data: any) {
    this.httpClient.put(`${this.appConfig.API_ENDPOINT}/api/system-settings/${id}`, { ...data }, { observe: 'response' }).subscribe({
      next: (response) => {
        this.systemSettingPut.next(response);
      },
      error: (error) => {
        this.systemSettingPut.next(error);
      }
    });
  }

  httpDeleteSystemSetting(id: any) {
    this.httpClient.delete(`${this.appConfig.API_ENDPOINT}/api/system-settings/${id}`, { observe: 'response' }).subscribe({
      next: (response) => {
        this.systemSettingDelete.next(response);
      },
      error: (error) => {
        this.systemSettingDelete.next(error);
      }
    });
  }
  
  httpGetAllSystemSettingsPaginate(params: any = []) {
    let httpParams = new HttpParams();

    for (const param of Object.keys(params)) {
      httpParams = httpParams.append(param, params[param]);
    }

    this.httpClient.get(`${this.appConfig.API_ENDPOINT}/api/system-settings/paginate`, { params: httpParams, observe: 'response' }).subscribe({
      next: (response) => {
        this.systemSettingsGetAllPaginate.next(response);
      },
      error: (error) => {
        this.systemSettingsGetAllPaginate.next(error);
      }
    });
  }

}
