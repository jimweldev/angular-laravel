import { Component, OnInit, OnDestroy, Injectable, Inject } from '@angular/core';
import { APP_CONFIG } from '@/app.config';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { SystemSettingService } from '@services/system-setting.service';

@Component({
  selector: 'app-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.scss']
})

@Injectable()
export class SystemSettingsComponent implements OnInit, OnDestroy {
  timeoutId: any = null;

  systemSettingPostForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    value: ['', Validators.required],
    type: ['', Validators.required],
    notes: ['', Validators.required],
  });

  systemSettingPutForm: FormGroup = this.formBuilder.group({
    id: ['', Validators.required],
    name: ['', Validators.required],
    value: ['', Validators.required],
    type: ['', Validators.required],
    notes: ['', Validators.required],
  });

  systemSettingsPaginate: any = {
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
    private formBuilder : FormBuilder,
    private systemSettingService: SystemSettingService) { }

  ngOnInit(): void {
    this.titleService.setTitle(`System Settings | ${this.appConfig.APP_NAME}`);

    this.onRefresh('systemSettingsPaginate');
  }

  onRefresh(type: string) {
    this.systemSettingsPaginate.isGetLoading = true;
    
    if (type === 'systemSettingsPaginate') {
      const data = { 
        search: this.systemSettingsPaginate.search,
        page: this.systemSettingsPaginate.page,
        limit: this.systemSettingsPaginate.limit 
      }

      this.systemSettingService.httpGetAllSystemSettingsPaginate(data);
    }
  }

  onSubmit(type: string) {
    if (type === 'systemSettings') {
      if (this.systemSettingPostForm.valid) {
        this.systemSettingsPaginate.isPostLoading = true;
        this.systemSettingService.httpPostSystemSetting(this.systemSettingPostForm.value);
      }
    }
  }

  onEdit(type: string, data: any) {
    if (type === 'systemSettings') {
      this.systemSettingPutForm.controls['id'].setValue(data.id);
      this.systemSettingPutForm.controls['name'].setValue(data.name);
      this.systemSettingPutForm.controls['value'].setValue(data.value);
      this.systemSettingPutForm.controls['type'].setValue(data.type);
      this.systemSettingPutForm.controls['notes'].setValue(data.notes);
    }
  }

  onUpdate(type: string) {
    if (type === 'systemSettings') {
      if (this.systemSettingPutForm.valid) {
        this.systemSettingsPaginate.isPutLoading = true;

        const { id, ...newValues } = this.systemSettingPutForm.value;
        
        this.systemSettingService.httpPutSystemSetting(id, newValues);
      }
    }
  }

  onDelete(type: string, data: any) {
    if (type === 'systemSettings') {
      Swal.fire({
        html: `<p>Are you sure you want to delete <b>${data.name}</b>?</p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        confirmButtonColor: '#DC3545',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.systemSettingsPaginate.isDeleteLoading = true;

          this.systemSettingService.httpDeleteSystemSetting(data.id);
        }
      })
    }
  }

  onInputSearch(type: string) {
    if (type === 'systemSettingsPaginate') {
      this.debounce(() => {
        this.systemSettingsPaginate.page = 1;

        this.onRefresh("systemSettingsPaginate");
      }, 200);
    }
  }

  debounce(callback: any, timeout: number) {
    clearTimeout(this.timeoutId);

    this.timeoutId = setTimeout(() => callback(), timeout);
  }

  systemSettingsGetAllPaginateSubscription = this.systemSettingService.systemSettingsGetAllPaginate.subscribe(
    (response: any) => {
      if (response.ok) {
        this.systemSettingsPaginate.records = response.body.records;
        this.systemSettingsPaginate.totalPages = response.body.info.total_pages;
        this.systemSettingsPaginate.totalRecords = response.body.info.total_records;
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

      this.systemSettingsPaginate.isGetLoading = false;
    }
  );

  systemSettingPostSubscription = this.systemSettingService.systemSettingPost.subscribe(
    (response: any) => {
      if (response.ok) {
        this.systemSettingPostForm.reset();

        this.onRefresh('systemSettingsPaginate');

        Swal.fire({
          title: 'Success!',
          text: 'Successfully created user.',
          icon: 'success',
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
          showCloseButton: true,
        });
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

      this.systemSettingsPaginate.isPostLoading = false;
    }
  );

  systemSettingPutSubscription = this.systemSettingService.systemSettingPut.subscribe(
    (response: any) => {
      if (response.ok) {
        this.onRefresh('systemSettingsPaginate');

        Swal.fire({
          title: 'Success!',
          text: 'Successfully updated user.',
          icon: 'success',
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
          showCloseButton: true,
        });
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

      this.systemSettingsPaginate.isPutLoading = false;
    }
  );

  systemSettingDeleteSubscription = this.systemSettingService.systemSettingDelete.subscribe(
    (response: any) => {
      if (response.ok) {
        this.onRefresh('systemSettingsPaginate');

        Swal.fire({
          title: 'Success!',
          text: 'Successfully deleted user.',
          icon: 'success',
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          position: 'top-right',
          timerProgressBar: true,
          showCloseButton: true,
        });
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

      this.systemSettingsPaginate.isDeleteLoading = false;
    }
  );

  ngOnDestroy(): void {
    this.systemSettingsGetAllPaginateSubscription.unsubscribe();
    this.systemSettingPostSubscription.unsubscribe();
    this.systemSettingPutSubscription.unsubscribe();
    this.systemSettingDeleteSubscription.unsubscribe();
  }
}
