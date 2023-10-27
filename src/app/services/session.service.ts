import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {UserInterface} from "../interfaces/user-interface";

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private subject = new Subject<any>();

  sendAuthUser(user: UserInterface): void {
    this.subject.next({ user });
  }

  clearAuthUser(): void {
    this.subject.next({});
  }

  onAuthUser(): Observable<any> {
    return this.subject.asObservable();
  }
}
