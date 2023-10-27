import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  inProgress = new Subject<boolean>();

  constructor() {}

  onSpinner(): Observable<boolean> {
    return this.inProgress.asObservable();
  }

  show(): void {
    this.inProgress.next(true);
  }

  hide(): void {
    this.inProgress.next(false);
  }}
