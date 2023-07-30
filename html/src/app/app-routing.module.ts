import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivateLayoutComponent } from '@layouts/private-layout/private-layout.component';
import { PublicLayoutComponent } from '@layouts/public-layout/public-layout.component';
import { HomeComponent } from '@pages/private/home/home.component';
import { LoginComponent } from '@pages/public/login/login.component';
import { AuthGuard } from '@guards/auth.guard';
import { NonAuthGuard } from '@guards/non-auth.guard';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from '@layouts/admin-layout/admin-layout.component';
import { RedirectLayoutComponent } from '@layouts/redirect-layout/redirect-layout.component';
import { AdminComponent } from '@pages/private/admin/admin.component';
import { UserManagementComponent } from '@pages/private/admin/user-management/user-management.component';
import { ConfigurationsComponent } from '@pages/private/admin/configurations/configurations.component';
import { LogsComponent } from '@pages/private/admin/logs/logs.component';
import { SystemUsersComponent } from '@pages/private/admin/user-management/system-users/system-users.component';
import { AppUsersComponent } from '@pages/private/admin/user-management/app-users/app-users.component';
import { UserAccessComponent } from '@pages/private/admin/user-management/user-access/user-access.component';
import { SystemSettingsComponent } from '@pages/private/admin/configurations/system-settings/system-settings.component';
import { SystemDropdownsComponent } from '@pages/private/admin/configurations/system-dropdowns/system-dropdowns.component';
import { MailLogsComponent } from '@pages/private/admin/logs/mail-logs/mail-logs.component';
import { SystemLogsComponent } from '@pages/private/admin/logs/system-logs/system-logs.component';
import { UserLogsComponent } from '@pages/private/admin/logs/user-logs/user-logs.component';

const routes: Routes = [
  // PRIVATE ROUTES
  {
    path: '',
    component: AppComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        component: RedirectLayoutComponent
      },

      // HOME
      {
        path: 'home',
        component: PrivateLayoutComponent,
        children: [
          {
            path: '',
            component: HomeComponent
          },
          {
            path: 'profile',
            component: HomeComponent
          },
          {
            path: 'users',
            component: HomeComponent
          },
        ]
      },

      // ADMIN
      {
        path: 'admin',
        component: AdminLayoutComponent,
        children: [
          {
            path: '',
            component: AdminComponent
          },

          // USER MANAGEMENT
          {
            path: 'user-management',
            component: UserManagementComponent,
            children: [
              {
                path: 'system-users',
                component: SystemUsersComponent
              },
              {
                path: 'app-users',
                component: AppUsersComponent
              },
              {
                path: 'user-access',
                component: UserAccessComponent
              },
            ]
          },

          // CONFIGURATIONS
          {
            path: 'configurations',
            component: ConfigurationsComponent,
            children: [
              {
                path: 'system-settings',
                component: SystemSettingsComponent
              },
              {
                path: 'system-dropdowns',
                component: SystemDropdownsComponent
              },
            ]
          },

          // LOGS
          {
            path: 'logs',
            component: LogsComponent,
            children: [
              {
                path: 'mail-logs',
                component: MailLogsComponent
              },
              {
                path: 'system-logs',
                component: SystemLogsComponent
              },
              {
                path: 'user-logs',
                component: UserLogsComponent
              },
            ]
          }
        ]
      },
    ]
  },

  // PUBLIC ROUTES
  {
    path: '',
    component: PublicLayoutComponent,
    canActivate: [NonAuthGuard],
    canActivateChild: [NonAuthGuard],
    children: [
      {
        path: 'login',
        component: LoginComponent,
      }
    ]
  },
  
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
