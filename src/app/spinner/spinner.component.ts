import { Component } from '@angular/core';
import {SpinnerService} from "./spinner.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {
  spinner = false;
  spinnerSubscription: Subscription | undefined;

  constructor(private spinnerService: SpinnerService) {
    this.spinnerSubscription = spinnerService.onSpinner().subscribe((res) => {
      this.spinner = res;
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.spinnerSubscription?.unsubscribe();
  }
}
