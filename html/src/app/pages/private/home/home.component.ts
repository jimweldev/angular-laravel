import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '@/app.config';
import { Title } from '@angular/platform-browser';
import { PermissionService } from '@services/permission.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  auth$: Observable<any>;

  permissions: any = [];

  permissionList: any = {
    records: []
  };
  
  constructor(@Inject(APP_CONFIG) public appConfig: any,
    private titleService: Title,
    private store: Store<{ count: number, auth: any }>,
    private permissionService: PermissionService) {
      this.auth$ = store.select('auth');
    }

  ngOnInit(): void {
    this.titleService.setTitle(`Home | ${this.appConfig.APP_NAME}`);
    this.auth$.subscribe(auth => {
      if (auth.roles) {
        auth.roles.map((role: any) => {
          role.permissions.map((permission: any) => {
            this.permissions.push(permission);
          });
        });
      }
    });

    this.permissionService.httpGetAllPermissions();
  }

  // permissions
  permissionsGetAllSubscription = this.permissionService.permissionsGetAll.subscribe(
    (response: any) => {
      if (response.ok) {
        this.permissionList.records = response.body.records;
      }
    }
  );

  ngOnDestroy(): void {
    this.permissionsGetAllSubscription.unsubscribe();
  }
}
