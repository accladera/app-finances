import {Injectable} from "@angular/core";
import {AuthService} from "./services/auth.service";
import {Observable, of, switchMap} from "rxjs";
import {PreloadingStrategy, Route} from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class AuthPreloadStrategy  implements PreloadingStrategy {
  constructor(private auth: AuthService) {}

  preload(route: Route, fn: () => Observable<any>): Observable<any> {
    return this.auth
      .isLoggedIn()
      .pipe(switchMap((isUserLoggedIn) => (isUserLoggedIn ? fn() : of(null))));
  }
}
