import { Component, OnInit, OnDestroy, Injectable, Inject } from '@angular/core';
import { APP_CONFIG } from '@/app.config';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { AppUserService } from '@services/app-user.service';

@Component({
  selector: 'app-app-users',
  templateUrl: './app-users.component.html',
  styleUrls: ['./app-users.component.scss']
})

@Injectable()
export class AppUsersComponent implements OnInit, OnDestroy {
  timeoutId: any = null;

  appUserPostForm: FormGroup = this.formBuilder.group({
    username: ['', Validators.required],
    pass_key: ['', Validators.required],
  });

  appUserPutForm: FormGroup = this.formBuilder.group({
    id: ['', Validators.required],
    username: ['', Validators.required],
    pass_key: ['', Validators.required],
  });

  appUsersPaginate: any = {
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
    private appUserService: AppUserService) { }

  ngOnInit(): void {
    this.titleService.setTitle(`App Users | ${this.appConfig.APP_NAME}`);

    this.onRefresh('appUsersPaginate');
  }

  onRefresh(type: string) {
    this.appUsersPaginate.isGetLoading = true;
    
    if (type === 'appUsersPaginate') {
      const data = { 
        search: this.appUsersPaginate.search,
        page: this.appUsersPaginate.page,
        limit: this.appUsersPaginate.limit 
      }

      this.appUserService.httpGetAllAppUsersPaginate(data);
    }
  }

  onSubmit(type: string) {
    if (type === 'appUsers') {
      if (this.appUserPostForm.valid) {
        this.appUsersPaginate.isPostLoading = true;
        this.appUserService.httpPostAppUser(this.appUserPostForm.value);
      }
    }
  }

  onEdit(type: string, data: any) {
    if (type === 'appUsers') {
      this.appUserPutForm.controls['id'].setValue(data.id);
      this.appUserPutForm.controls['username'].setValue(data.username);
      this.appUserPutForm.controls['pass_key'].setValue(data.pass_key);
    }
  }

  onUpdate(type: string) {
    if (type === 'appUsers') {
      if (this.appUserPutForm.valid) {
        this.appUsersPaginate.isPutLoading = true;

        const { id, ...newValues } = this.appUserPutForm.value;
        
        this.appUserService.httpPutAppUser(id, newValues);
      }
    }
  }

  onDelete(type: string, data: any) {
    if (type === 'appUsers') {
      Swal.fire({
        html: `<p>Are you sure you want to delete <b>${data.username}</b>?</p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        confirmButtonColor: '#DC3545',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.appUsersPaginate.isDeleteLoading = true;

          this.appUserService.httpDeleteAppUser(data.id);
        }
      })
    }
  }

  onInputSearch(type: string) {
    if (type === 'appUsersPaginate') {
      this.debounce(() => {
        this.appUsersPaginate.page = 1;

        this.onRefresh("appUsersPaginate");
      }, 200);
    }
  }

  debounce(callback: any, timeout: number) {
    clearTimeout(this.timeoutId);

    this.timeoutId = setTimeout(() => callback(), timeout);
  }

  appUsersGetAllPaginateSubscription = this.appUserService.appUsersGetAllPaginate.subscribe(
    (response: any) => {
      if (response.ok) {
        this.appUsersPaginate.records = response.body.records;
        this.appUsersPaginate.totalPages = response.body.info.total_pages;
        this.appUsersPaginate.totalRecords = response.body.info.total_records;
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

      this.appUsersPaginate.isGetLoading = false;
    }
  );

  appUserPostSubscription = this.appUserService.appUserPost.subscribe(
    (response: any) => {
      if (response.ok) {
        this.appUserPostForm.reset();

        this.onRefresh('appUsersPaginate');

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

      this.appUsersPaginate.isPostLoading = false;
    }
  );

  appUserPutSubscription = this.appUserService.appUserPut.subscribe(
    (response: any) => {
      if (response.ok) {
        this.onRefresh('appUsersPaginate');

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

      this.appUsersPaginate.isPutLoading = false;
    }
  );

  appUserDeleteSubscription = this.appUserService.appUserDelete.subscribe(
    (response: any) => {
      if (response.ok) {
        this.onRefresh('appUsersPaginate');

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

      this.appUsersPaginate.isDeleteLoading = false;
    }
  );

  ngOnDestroy(): void {
    this.appUsersGetAllPaginateSubscription.unsubscribe();
    this.appUserPostSubscription.unsubscribe();
    this.appUserPutSubscription.unsubscribe();
    this.appUserDeleteSubscription.unsubscribe();
  }
}
