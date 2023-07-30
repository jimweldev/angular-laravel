import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { APP_CONFIG } from '@/app.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  login = new Subject<any>();
  logout = new Subject<any>();

  constructor(@Inject(APP_CONFIG) private appConfig: any,
    private httpClient: HttpClient) { }

  httpLogin(credentials: any) {
    this.httpClient.post(`${this.appConfig.API_ENDPOINT}/api/auth/login`, credentials, { observe: 'response' }).subscribe({
      next: (response) => {
        this.login.next(response);
      },
      error: (error) => {
        this.login.next(error);
      }
    });
  }

  httpLogout() {
    this.httpClient.post(`${this.appConfig.API_ENDPOINT}/api/auth/logout`, {}, { observe: 'response' }).subscribe({
      next: (response) => {
        this.logout.next(response);
      },
      error: (error) => {
        this.logout.next(error);
      }
    });
  }
}
