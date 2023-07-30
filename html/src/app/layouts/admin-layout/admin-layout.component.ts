import { Component, OnInit, OnDestroy, Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { UserService } from '@services/user.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { setAuth, removeAuth } from '@/store/auth/auth.actions';
import { APP_CONFIG } from '@/app.config';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})

@Injectable()
export class AdminLayoutComponent implements OnInit, OnDestroy {
  auth$: Observable<any>;

  isInitalLoading: boolean = false;
  isSuccess: boolean = false;
  isSidebarCollapsed: boolean = false;
  isLoaded: boolean = false;

  constructor(@Inject(APP_CONFIG) public appConfig: any,
    private store: Store<{ count: number, auth: any }>,
    private router: Router,
    private authService: AuthService,
    private userService: UserService) {
      this.auth$ = store.select('auth');
    }
  
  ngOnInit(): void {
    this.onRefresh('getMe');
  }

  onRefresh(type: string) {
    if (type === 'getMe') {
      this.auth$.subscribe((auth) => {
        if (!auth.user && !this.isLoaded) {
          this.isInitalLoading = true;
          this.isSuccess = false;
          this.userService.httpGetMeUser();
        } else {
          this.isSuccess = true;
        }

        if (auth.user && !auth.user.is_admin) {
          this.router.navigate(['/home']);
        }

        this.isLoaded = true;
      });
    }
  }

  onToggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  onLogout() {
    this.authService.httpLogout();
  }

  logoutSubscription = this.authService.logout.subscribe(
    (response: any) => {
      if (response.ok) {
        localStorage.removeItem('token');
        this.store.dispatch(removeAuth());
        this.router.navigate(['/login']);
      }
    }
  );

  userGetMeSubscription = this.userService.userGetMe.subscribe(
    (response: any) => {
      if (response.ok) {
        this.isSuccess = true;
        this.store.dispatch(setAuth({ user: response.body.user, roles: response.body.roles }));
      } else {
        this.isSuccess = false;
      }

      this.isInitalLoading = false;
    }
  );

  ngOnDestroy(): void {
    this.logoutSubscription.unsubscribe();
    this.userGetMeSubscription.unsubscribe();
  }
}
