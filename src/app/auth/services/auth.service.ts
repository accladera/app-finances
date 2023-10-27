import { Injectable } from '@angular/core';
import {catchError, map, Observable, of, tap} from "rxjs";
import {AuthenticationRequest} from "../interface/authentication-request";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {SessionService} from "../../services/session.service";
import { UserInterface } from 'src/app/interfaces/user-interface';
import { AuthenticationResponse } from '../interface/authentication-response';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl: string = environment.apiUrl;
  private baseUrl = `${this.apiUrl}user`;
  private _authUser: AuthenticationResponse | undefined;

  get authUser(): AuthenticationResponse {
    return { ...this._authUser! };
  }

  constructor(
    private http: HttpClient,
    private sessionService: SessionService,
  ) {}


  register(auth: AuthenticationRequest): Observable<any> {
    localStorage.clear();
    const url = `${this.baseUrl}/register`;
    return this.http.post<boolean>(url, auth)
  }

  login(auth: AuthenticationRequest): Observable<any> {
    localStorage.clear();
    const url = `${this.baseUrl}/login`;
    return this.http.post<AuthenticationResponse>(url, auth).pipe(
      tap((res: AuthenticationResponse) => {
          //localStorage.setItem('token', res.token);
          localStorage.setItem('userId', res.id + '');
          this._authUser = res;
      }),
      catchError((err) => of(err.error))
    );
  }

  validateToken(): Observable<any> {
    const url = `${this.baseUrl}/auth/validate`;
    return this.http.get<UserInterface>(url).pipe(
      map((res: UserInterface) => {
       // localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.id + '');
        this._authUser= {
          id: res.id,
          email: res.email,
          saldo: res.saldo
        };
        return res.enabled;
      }),
      catchError((err) => of(false))
    );
  }


  logout(): void {
    this._authUser = undefined;
    localStorage.clear();
  }

  isLoggedIn(): Observable<boolean> {
    return of(this._authUser !== undefined);
  }}
