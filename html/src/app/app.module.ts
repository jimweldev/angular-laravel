import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { PrivateLayoutComponent } from './layouts/private-layout/private-layout.component';
import { LoginComponent } from './pages/public/login/login.component';
import { HomeComponent } from './pages/private/home/home.component';
import { AuthService } from './services/auth.service';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { StoreModule } from '@ngrx/store';
import { authReducer } from './store/auth/auth.reducer';
import { AuthInterceptor } from './services/auth.interceptor';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { RedirectLayoutComponent } from './layouts/redirect-layout/redirect-layout.component';
import { AdminComponent } from './pages/private/admin/admin.component';
import { LogsComponent } from './pages/private/admin/logs/logs.component';
import { UserManagementComponent } from './pages/private/admin/user-management/user-management.component';
import { SystemUsersComponent } from './pages/private/admin/user-management/system-users/system-users.component';
import { AppUsersComponent } from './pages/private/admin/user-management/app-users/app-users.component';
import { UserAccessComponent } from './pages/private/admin/user-management/user-access/user-access.component';
import { SystemSettingsComponent } from './pages/private/admin/settings/system-settings/system-settings.component';
import { SystemDropdownsComponent } from './pages/private/admin/settings/system-dropdowns/system-dropdowns.component';
import { MailLogsComponent } from './pages/private/admin/logs/mail-logs/mail-logs.component';
import { SystemLogsComponent } from './pages/private/admin/logs/system-logs/system-logs.component';
import { UserLogsComponent } from './pages/private/admin/logs/user-logs/user-logs.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { APP_CONFIG, AppConfig } from './app.config';
import { TableLoadingComponent } from './components/table-loading/table-loading.component';
import { AppLoadingComponent } from './components/app-loading/app-loading.component';
import { SettingsComponent } from './pages/private/admin/settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    PrivateLayoutComponent,
    PublicLayoutComponent,
    HomeComponent,
    LoginComponent,
    AdminLayoutComponent,
    RedirectLayoutComponent,
    AdminComponent,
    LogsComponent,
    UserManagementComponent,
    SystemUsersComponent,
    AppUsersComponent,
    UserAccessComponent,
    SystemSettingsComponent,
    SystemDropdownsComponent,
    MailLogsComponent,
    SystemLogsComponent,
    UserLogsComponent,
    TableLoadingComponent,
    AppLoadingComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    FeatherModule.pick(allIcons),
    NgbModule,
    NgSelectModule,
    StoreModule.forRoot({ auth: authReducer }),
    FontAwesomeModule,
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
  ],
  providers: [
    AuthService,
    AuthInterceptor,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: APP_CONFIG, useValue: AppConfig },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
