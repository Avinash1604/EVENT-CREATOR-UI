import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToasTMessageService {

  currentUserData: any = null;
  constructor(
    private toastrService: ToastrService
  ) {
 
  }

  success(message: string, title?: string) {
    this.toastrService.success(message, title ?? 'Success', {
      progressBar: true,
      progressAnimation: 'decreasing',
      closeButton: true,
      timeOut: 3000
    });
  }


  errorToast(message: string, title?: string) {
    this.toastrService.error(message, title ?? 'Error', {
      progressBar: true,
      progressAnimation: 'decreasing',
      closeButton: true,
      timeOut: 3000
    });
  }

  info(message: string, title?: string) {
    this.toastrService.info(message, title ?? 'Information', {
      progressBar: true,
      progressAnimation: 'decreasing',
      closeButton: true,
      timeOut: 3000
    });
  }

  warn(message: string, title?: string) {
    this.toastrService.warning(message, title ?? 'Warning', {
      progressBar: true,
      progressAnimation: 'decreasing',
      closeButton: true,
      timeOut: 3000
    });
  }
}
