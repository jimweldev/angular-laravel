import { Component, OnInit, OnDestroy, Injectable, Inject } from '@angular/core';
import { APP_CONFIG } from '@/app.config';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { SystemDropdownService } from '@services/system-dropdown.service';

@Component({
  selector: 'app-system-dropdowns',
  templateUrl: './system-dropdowns.component.html',
  styleUrls: ['./system-dropdowns.component.scss']
})

@Injectable()
export class SystemDropdownsComponent implements OnInit, OnDestroy {
  timeoutId: any = null;

  systemDropdownPostForm: FormGroup = this.formBuilder.group({
    module: ['', Validators.required],
    name: ['', Validators.required],
    value: ['', Validators.required],
    default: [false, Validators.required],
  });

  systemDropdownPutForm: FormGroup = this.formBuilder.group({
    id: ['', Validators.required],
    module: ['', Validators.required],
    name: ['', Validators.required],
    value: ['', Validators.required],
    default: [false, Validators.required],
  });

  systemDropdownsPaginate: any = {
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
    private systemDropdownService: SystemDropdownService) { }

  ngOnInit(): void {
    this.titleService.setTitle(`System Dropdowns | ${this.appConfig.APP_NAME}`);

    this.onRefresh('systemDropdownsPaginate');
  }

  onRefresh(type: string) {
    this.systemDropdownsPaginate.isGetLoading = true;
    
    if (type === 'systemDropdownsPaginate') {
      const data = { 
        search: this.systemDropdownsPaginate.search,
        page: this.systemDropdownsPaginate.page,
        limit: this.systemDropdownsPaginate.limit 
      }

      this.systemDropdownService.httpGetAllSystemDropdownsPaginate(data);
    }
  }

  onSubmit(type: string) {
    if (type === 'systemDropdowns') {
      if (this.systemDropdownPostForm.valid) {
        this.systemDropdownsPaginate.isPostLoading = true;
        this.systemDropdownService.httpPostSystemDropdown(this.systemDropdownPostForm.value);
      }
    }
  }

  onEdit(type: string, data: any) {
    if (type === 'systemDropdowns') {
      this.systemDropdownPutForm.controls['id'].setValue(data.id);
      this.systemDropdownPutForm.controls['module'].setValue(data.module);
      this.systemDropdownPutForm.controls['name'].setValue(data.name);
      this.systemDropdownPutForm.controls['value'].setValue(data.value);
      this.systemDropdownPutForm.controls['default'].setValue(data.default);
    }
  }

  onUpdate(type: string) {
    if (type === 'systemDropdowns') {
      if (this.systemDropdownPutForm.valid) {
        this.systemDropdownsPaginate.isPutLoading = true;

        const { id, ...newValues } = this.systemDropdownPutForm.value;
        
        this.systemDropdownService.httpPutSystemDropdown(id, newValues);
      }
    }
  }

  onDelete(type: string, data: any) {
    if (type === 'systemDropdowns') {
      Swal.fire({
        html: `<p>Are you sure you want to delete <b>${data.name}</b>?</p>
        <p><b>[${data.module}]</b></p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        confirmButtonColor: '#DC3545',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.systemDropdownsPaginate.isDeleteLoading = true;

          this.systemDropdownService.httpDeleteSystemDropdown(data.id);
        }
      })
    }
  }

  onInputSearch(type: string) {
    if (type === 'systemDropdownsPaginate') {
      this.debounce(() => {
        this.systemDropdownsPaginate.page = 1;

        this.onRefresh("systemDropdownsPaginate");
      }, 200);
    }
  }

  debounce(callback: any, timeout: number) {
    clearTimeout(this.timeoutId);

    this.timeoutId = setTimeout(() => callback(), timeout);
  }

  systemDropdownsGetAllPaginateSubscription = this.systemDropdownService.systemDropdownsGetAllPaginate.subscribe(
    (response: any) => {
      if (response.ok) {
        this.systemDropdownsPaginate.records = response.body.records;
        this.systemDropdownsPaginate.totalPages = response.body.info.total_pages;
        this.systemDropdownsPaginate.totalRecords = response.body.info.total_records;
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

      this.systemDropdownsPaginate.isGetLoading = false;
    }
  );

  systemDropdownPostSubscription = this.systemDropdownService.systemDropdownPost.subscribe(
    (response: any) => {
      if (response.ok) {
        this.systemDropdownPostForm.reset({ default: false });

        this.onRefresh('systemDropdownsPaginate');

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

      this.systemDropdownsPaginate.isPostLoading = false;
    }
  );

  systemDropdownPutSubscription = this.systemDropdownService.systemDropdownPut.subscribe(
    (response: any) => {
      if (response.ok) {
        this.onRefresh('systemDropdownsPaginate');

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

      this.systemDropdownsPaginate.isPutLoading = false;
    }
  );

  systemDropdownDeleteSubscription = this.systemDropdownService.systemDropdownDelete.subscribe(
    (response: any) => {
      if (response.ok) {
        this.onRefresh('systemDropdownsPaginate');

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

      this.systemDropdownsPaginate.isDeleteLoading = false;
    }
  );

  ngOnDestroy(): void {
    this.systemDropdownsGetAllPaginateSubscription.unsubscribe();
    this.systemDropdownPostSubscription.unsubscribe();
    this.systemDropdownPutSubscription.unsubscribe();
    this.systemDropdownDeleteSubscription.unsubscribe();
  }
}
