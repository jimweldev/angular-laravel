import { Component, OnInit, OnDestroy, Injectable, Inject } from '@angular/core';
import { APP_CONFIG } from '@/app.config';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '@services/user.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-system-users',
  templateUrl: './system-users.component.html',
  styleUrls: ['./system-users.component.scss']
})

@Injectable()
export class SystemUsersComponent implements OnInit, OnDestroy {
  timeoutId: any = null;

  userPostForm: FormGroup = this.formBuilder.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    password_confirmation: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    alternate_email: ['', [Validators.email]],
    last_name: ['', Validators.required],
    first_name: ['', Validators.required],
    middle_name: ['', Validators.required],
    position: ['', Validators.required],
    is_admin: [false, Validators.required],
  });

  userPutForm: FormGroup = this.formBuilder.group({
    id: ['', Validators.required],
    username: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    password_confirmation: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    alternate_email: ['', [Validators.email]],
    last_name: ['', Validators.required],
    first_name: ['', Validators.required],
    middle_name: ['', Validators.required],
    position: ['', Validators.required],
    is_admin: [false, Validators.required],
  });

  usersPaginate: any = {
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
    private userService: UserService) { }

  ngOnInit(): void {
    this.titleService.setTitle(`System Users | ${this.appConfig.APP_NAME}`);

    this.onRefresh('usersPaginate');
  }

  onRefresh(type: string) {
    this.usersPaginate.isGetLoading = true;
    
    if (type === 'usersPaginate') {
      const data = { 
        search: this.usersPaginate.search,
        page: this.usersPaginate.page,
        limit: this.usersPaginate.limit 
      }

      this.userService.httpGetAllUsersPaginate(data);
    }
  }

  onSubmit(type: string) {
    if (type === 'users') {
      if (this.userPostForm.valid) {
        this.usersPaginate.isPostLoading = true;
        // this.userService.httpPostUser(this.userPostForm.value);
        console.log(this.userPostForm.value)
      }
    }
  }

  onEdit(type: string, data: any) {
    if (type === 'users') {
      this.userPutForm.controls['id'].setValue(data.id);
      this.userPutForm.controls['username'].setValue(data.username);
      this.userPutForm.controls['email'].setValue(data.email);
      this.userPutForm.controls['alternate_email'].setValue(data.alternate_email);
      this.userPutForm.controls['last_name'].setValue(data.last_name);
      this.userPutForm.controls['first_name'].setValue(data.first_name);
      this.userPutForm.controls['middle_name'].setValue(data.middle_name);
      this.userPutForm.controls['position'].setValue(data.position);
      this.userPutForm.controls['is_admin'].setValue(data.is_admin);
    }
  }

  onUpdate(type: string) {
    if (type === 'users') {
      if (this.userPutForm.valid) {
        this.usersPaginate.isPutLoading = true;

        const { id, ...newValues } = this.userPutForm.value;
        
        this.userService.httpPutUser(id, newValues);
      }
    }
  }

  onDelete(type: string, data: any) {
    if (type === 'users') {
      Swal.fire({
        html: `<p>Are you sure you want to delete <b>${data.first_name} ${data.last_name}</b>?</p>
        <p class="mb-0"><b>[${data.position}]</b></p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        confirmButtonColor: '#DC3545',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.usersPaginate.isDeleteLoading = true;

          this.userService.httpDeleteUser(data.id);
        }
      })
    }
  }

  onInputSearch(type: string) {
    if (type === 'usersPaginate') {
      this.debounce(() => {
        this.usersPaginate.page = 1;

        this.onRefresh("usersPaginate");
      }, 200);
    }
  }

  debounce(callback: any, timeout: number) {
    clearTimeout(this.timeoutId);

    this.timeoutId = setTimeout(() => callback(), timeout);
  }

  usersGetAllPaginateSubscription = this.userService.usersGetAllPaginate.subscribe(
    (response: any) => {
      if (response.ok) {
        this.usersPaginate.records = response.body.records;
        this.usersPaginate.totalPages = response.body.info.total_pages;
        this.usersPaginate.totalRecords = response.body.info.total_records;
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

      this.usersPaginate.isGetLoading = false;
    }
  );

  userPostSubscription = this.userService.userPost.subscribe(
    (response: any) => {
      if (response.ok) {
        this.userPostForm.reset({ is_admin: false });

        this.onRefresh('usersPaginate');

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

      this.usersPaginate.isPostLoading = false;
    }
  );

  userPutSubscription = this.userService.userPut.subscribe(
    (response: any) => {
      if (response.ok) {
        this.onRefresh('usersPaginate');

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

      this.usersPaginate.isPutLoading = false;
    }
  );

  userDeleteSubscription = this.userService.userDelete.subscribe(
    (response: any) => {
      if (response.ok) {
        this.onRefresh('usersPaginate');

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

      this.usersPaginate.isDeleteLoading = false;
    }
  );

  ngOnDestroy(): void {
    this.usersGetAllPaginateSubscription.unsubscribe();
    this.userPostSubscription.unsubscribe();
    this.userPutSubscription.unsubscribe();
    this.userDeleteSubscription.unsubscribe();
  }
}
