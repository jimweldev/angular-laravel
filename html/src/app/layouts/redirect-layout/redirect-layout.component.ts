import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserService } from '@services/user.service';
import { setAuth } from '@/store/auth/auth.actions';

@Component({
  selector: 'app-redirect-layout',
  templateUrl: './redirect-layout.component.html',
  styleUrls: ['./redirect-layout.component.scss']
})
export class RedirectLayoutComponent implements OnInit {
  auth$: Observable<any>;
  
  isInitalLoading: boolean = false;
  isSuccess: boolean = false;
  isLoaded: boolean = false;
  
  constructor(private store: Store<{ count: number, auth: any }>,
    private router: Router,
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
          if (auth.user && auth.user.is_admin) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/home']);
          }
        }

        this.isLoaded = true;
      });
    }
  }

  userGetMeSubscription = this.userService.userGetMe.subscribe(
    (response: any) => {
      if (response.ok) {
        this.store.dispatch(setAuth({ user: response.body.user, roles: response.body.roles }));
        this.isSuccess = true;

        if (response.body.record.is_admin) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/home']);
        }
      } else {
        this.isSuccess = false;
      }

      this.isInitalLoading = false;
    }
  );

  ngOnDestroy(): void {
    this.userGetMeSubscription.unsubscribe();
  }
}
