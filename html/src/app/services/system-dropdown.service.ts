import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { APP_CONFIG } from '@/app.config';

@Injectable({
    providedIn: 'root'
})
export class SystemDropdownService {
  systemDropdownsGetAll = new Subject<any>();
  systemDropdownPost = new Subject<any>();
  systemDropdownPut = new Subject<any>();
  systemDropdownDelete = new Subject<any>();
  systemDropdownsGetAllPaginate = new Subject<any>();

  constructor(@Inject(APP_CONFIG) private appConfig: any,
    private httpClient: HttpClient) {}

  httpGetAllSystemDropdowns(params: any = []) {
    let httpParams = new HttpParams();

    for (const param of Object.keys(params)) {
      httpParams = httpParams.append(param, params[param]);
    }

    this.httpClient.get(`${this.appConfig.API_ENDPOINT}/api/system-dropdowns`, { params: httpParams, observe: 'response' }).subscribe({
      next: (response) => {
        this.systemDropdownsGetAll.next(response);
      },
      error: (error) => {
        this.systemDropdownsGetAll.next(error);
      }
    });
  }

  httpPostSystemDropdown(data: any) {
    this.httpClient.post(`${this.appConfig.API_ENDPOINT}/api/system-dropdowns`, { ...data }, { observe: 'response' }).subscribe({
      next: (response) => {
        this.systemDropdownPost.next(response);
      },
      error: (error) => {
        this.systemDropdownPost.next(error);
      }
    });
  }

  httpPutSystemDropdown(id: any, data: any) {
    this.httpClient.put(`${this.appConfig.API_ENDPOINT}/api/system-dropdowns/${id}`, { ...data }, { observe: 'response' }).subscribe({
      next: (response) => {
        this.systemDropdownPut.next(response);
      },
      error: (error) => {
        this.systemDropdownPut.next(error);
      }
    });
  }

  httpDeleteSystemDropdown(id: any) {
    this.httpClient.delete(`${this.appConfig.API_ENDPOINT}/api/system-dropdowns/${id}`, { observe: 'response' }).subscribe({
      next: (response) => {
        this.systemDropdownDelete.next(response);
      },
      error: (error) => {
        this.systemDropdownDelete.next(error);
      }
    });
  }
  
  httpGetAllSystemDropdownsPaginate(params: any = []) {
    let httpParams = new HttpParams();

    for (const param of Object.keys(params)) {
      httpParams = httpParams.append(param, params[param]);
    }

    this.httpClient.get(`${this.appConfig.API_ENDPOINT}/api/system-dropdowns/paginate`, { params: httpParams, observe: 'response' }).subscribe({
      next: (response) => {
        this.systemDropdownsGetAllPaginate.next(response);
      },
      error: (error) => {
        this.systemDropdownsGetAllPaginate.next(error);
      }
    });
  }

}
