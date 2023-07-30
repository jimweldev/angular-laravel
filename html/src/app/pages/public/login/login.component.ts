import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { setAuth } from '@/store/auth/auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoginLoading: boolean = false;

  loginForm: FormGroup = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private store: Store<{ count: number, auth: any }>,
    private router: Router,
    private titleService: Title,
    private formBuilder : FormBuilder,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.titleService.setTitle(`Login`);
  }

  onSubmit(type: string) {
    if (type === 'login') {
      if (this.loginForm.valid) {
        this.isLoginLoading = true;
        this.authService.httpLogin(this.loginForm.value);
      }
    }
  }

  loginSubscription = this.authService.login.subscribe(
    (response: any) => {
      if (response.ok) {
        localStorage.setItem('token', response.body.token);
        this.store.dispatch(setAuth({ user: response.body.user, roles: response.body.roles }));
        this.router.navigate(['/']);
      }

      this.isLoginLoading = false;
    }
  );

  ngOnDestroy(): void {
    this.loginSubscription.unsubscribe();
  }
}
