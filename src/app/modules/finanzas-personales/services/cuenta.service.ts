import {Injectable} from '@angular/core';
import {Cuenta} from "../interface/cuenta";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { SimpleFilter } from '../interface/simple-filter';
import { UserFilter } from '../interface/user-filter';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {
  baseUrl = `${environment.apiUrl}Cuenta`;

  form: FormGroup = new FormGroup({});
  cuenta!: Cuenta;
  actionId!: number;
  constructor(private http: HttpClient, private formBuilder: FormBuilder) {
  }


  initializeFormGroup(cuenta: any): void {
    this.form = this.formBuilder.group({
      id: new FormControl(cuenta ? cuenta.id : ''),
      propietarioId: new FormControl(cuenta ? cuenta.propietarioId : ''),
      nombre: new FormControl(cuenta ? cuenta.nombre : '', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
      ]),
      saldo: new FormControl(cuenta ? cuenta.saldo : '', [
        Validators.required,
      ]),
    });
  }



  getAllByUserId(filter: UserFilter): Observable<any> {
    const url = `${this.baseUrl}/byUser`;
    return this.http.post<Cuenta[]>(url,filter);
  }

  save(cuenta: Cuenta): Observable<any> {
    const url = `${this.baseUrl}`;
    return this.http.post<Cuenta>(url, cuenta);
  }

  update(cuenta: Cuenta): Observable<any> {
    const url = `${this.baseUrl}`;
    return this.http.put<Cuenta>(url, cuenta);
  }
  
  
  delete(cuentaId: string): Observable<any>{
    const url = `${this.baseUrl}`;
    return this.http.delete<any>(url,{body:{Id: cuentaId}});
  }

}
