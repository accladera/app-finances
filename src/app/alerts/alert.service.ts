import { Injectable } from '@angular/core';
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  config = {
    positionClass: 'toast-custom-position',
    toastClass: 'toast-custom-template',
    // disableTimeOut: true,
    // tapToDismiss: false,
    // closeButton: true
  };

  constructor(private toast: ToastrService) {}

  success(message: any, title: any): void {
    this.toast.success(message, title, this.config);
  }

  error(message: any, title: any): void {
    this.toast.error(message, title, this.config);
  }

  warning(message: any, title: any): void {
    this.toast.warning(message, title, this.config);
  }

  info(message: any, title: any): void {
    this.toast.info(message, title, this.config);
  }

  clear(message: any): void {
    this.toast.clear(message);
  }
}
