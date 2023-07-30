import { Component, OnInit, OnDestroy, Injectable, Inject } from '@angular/core';
import { APP_CONFIG } from '@/app.config';
import { Title } from '@angular/platform-browser';
import Swal from 'sweetalert2'
import { UserLogService } from '@services/user-log.service';


@Component({
  selector: 'app-user-logs',
  templateUrl: './user-logs.component.html',
  styleUrls: ['./user-logs.component.scss']
})

@Injectable()
export class UserLogsComponent implements OnInit, OnDestroy {
  timeoutId: any = null;

  userLogsPaginate: any = {
    isGetLoading: false,
    isPostLoading: false,
    isPutLoading: false,
    isDeleteLoading: false,
    search: '',
    page: 1,
    limit: 10,
    pages: [],
    records: [],
    totalPages: 0,
    totalRecords: 0,
  };

  constructor(@Inject(APP_CONFIG) private appConfig: any,
    private titleService: Title,
    private userLogService: UserLogService) { }

  ngOnInit(): void {
    this.titleService.setTitle(`User Logs | ${this.appConfig.APP_NAME}`);

    this.onRefresh('userLogsPaginate');
  }

  onRefresh(type: string) {
    this.userLogsPaginate.isGetLoading = true;
    
    if (type === 'userLogsPaginate') {
      const data = { 
        search: this.userLogsPaginate.search,
        page: this.userLogsPaginate.page,
        limit: this.userLogsPaginate.limit 
      }

      this.userLogService.httpGetAllUserLogsPaginate(data);
    }
  }

  onInputSearch(type: string) {
    if (type === 'userLogsPaginate') {
      this.debounce(() => {
        this.userLogsPaginate.page = 1;

        this.onRefresh("userLogsPaginate");
      }, 200);
    }
  }

  debounce(callback: any, timeout: number) {
    clearTimeout(this.timeoutId);

    this.timeoutId = setTimeout(() => callback(), timeout);
  }

  userLogsGetAllPaginateSubscription = this.userLogService.userLogsGetAllPaginate.subscribe(
    (response: any) => {
      if (response.ok) {
        this.userLogsPaginate.records = response.body.records;
        this.userLogsPaginate.totalPages = response.body.info.total_pages;
        this.userLogsPaginate.totalRecords = response.body.info.total_records;
      } else {
        Swal.fire({
          title: 'Error!',
          text: response.error.message,
          icon: 'error',
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
          showCloseButton: true,
        });
      }

      this.userLogsPaginate.isGetLoading = false;
    }
  );

  ngOnDestroy(): void {
    this.userLogsGetAllPaginateSubscription.unsubscribe();
  }
}
