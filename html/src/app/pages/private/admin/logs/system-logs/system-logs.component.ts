import { Component, OnInit, OnDestroy, Injectable, Inject } from '@angular/core';
import { APP_CONFIG } from '@/app.config';
import { Title } from '@angular/platform-browser';
import Swal from 'sweetalert2'
import { SystemLogService } from '@services/system-log.service';

@Component({
  selector: 'app-system-logs',
  templateUrl: './system-logs.component.html',
  styleUrls: ['./system-logs.component.scss']
})

@Injectable()
export class SystemLogsComponent implements OnInit, OnDestroy {
  timeoutId: any = null;

  systemLogsPaginate: any = {
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
    private systemLogService: SystemLogService) { }

  ngOnInit(): void {
    this.titleService.setTitle(`System Logs | ${this.appConfig.APP_NAME}`);

    this.onRefresh('systemLogsPaginate');
  }

  onRefresh(type: string) {
    this.systemLogsPaginate.isGetLoading = true;
    
    if (type === 'systemLogsPaginate') {
      const data = { 
        search: this.systemLogsPaginate.search,
        page: this.systemLogsPaginate.page,
        limit: this.systemLogsPaginate.limit 
      }

      this.systemLogService.httpGetAllSystemLogsPaginate(data);
    }
  }

  onInputSearch(type: string) {
    if (type === 'systemLogsPaginate') {
      this.debounce(() => {
        this.systemLogsPaginate.page = 1;

        this.onRefresh("systemLogsPaginate");
      }, 200);
    }
  }

  debounce(callback: any, timeout: number) {
    clearTimeout(this.timeoutId);

    this.timeoutId = setTimeout(() => callback(), timeout);
  }

  systemLogsGetAllPaginateSubscription = this.systemLogService.systemLogsGetAllPaginate.subscribe(
    (response: any) => {
      if (response.ok) {
        this.systemLogsPaginate.records = response.body.records;
        this.systemLogsPaginate.totalPages = response.body.info.total_pages;
        this.systemLogsPaginate.totalRecords = response.body.info.total_records;
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

      this.systemLogsPaginate.isGetLoading = false;
    }
  );

  ngOnDestroy(): void {
    this.systemLogsGetAllPaginateSubscription.unsubscribe();
  }
}
