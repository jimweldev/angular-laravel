import { Component, OnInit, OnDestroy, Injectable, Inject } from '@angular/core';
import { APP_CONFIG } from '@/app.config';
import { Title } from '@angular/platform-browser';
import Swal from 'sweetalert2'
import { MailLogService } from '@services/mail-log.service';

@Component({
  selector: 'app-mail-logs',
  templateUrl: './mail-logs.component.html',
  styleUrls: ['./mail-logs.component.scss']
})

@Injectable()
export class MailLogsComponent implements OnInit, OnDestroy {
  timeoutId: any = null;

  mailLogsPaginate: any = {
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
    private mailLogService: MailLogService) { }

  ngOnInit(): void {
    this.titleService.setTitle(`Mail Logs | ${this.appConfig.APP_NAME}`);

    this.onRefresh('mailLogsPaginate');
  }

  onRefresh(type: string) {
    this.mailLogsPaginate.isGetLoading = true;
    
    if (type === 'mailLogsPaginate') {
      const data = { 
        search: this.mailLogsPaginate.search,
        page: this.mailLogsPaginate.page,
        limit: this.mailLogsPaginate.limit 
      }

      this.mailLogService.httpGetAllMailLogsPaginate(data);
    }
  }

  onInputSearch(type: string) {
    if (type === 'mailLogsPaginate') {
      this.debounce(() => {
        this.mailLogsPaginate.page = 1;

        this.onRefresh("mailLogsPaginate");
      }, 200);
    }
  }

  debounce(callback: any, timeout: number) {
    clearTimeout(this.timeoutId);

    this.timeoutId = setTimeout(() => callback(), timeout);
  }

  mailLogsGetAllPaginateSubscription = this.mailLogService.mailLogsGetAllPaginate.subscribe(
    (response: any) => {
      if (response.ok) {
        this.mailLogsPaginate.records = response.body.records;
        this.mailLogsPaginate.totalPages = response.body.info.total_pages;
        this.mailLogsPaginate.totalRecords = response.body.info.total_records;
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

      this.mailLogsPaginate.isGetLoading = false;
    }
  );

  ngOnDestroy(): void {
    this.mailLogsGetAllPaginateSubscription.unsubscribe();
  }
}