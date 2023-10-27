import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Movimiento} from "../interface/movimiento";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {MovimientosFilter} from "../interface/movimientos-filter";
import {BalanceFilter} from "../interface/balance-filter";
import {Balance} from "../interface/balance";
import { SimpleFilter } from '../interface/simple-filter';
import { CuentaFilter } from '../interface/cuenta-filter';
import { UserFilter } from '../interface/user-filter';
import { CategoriaFilter } from '../interface/categoria-filter';

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {

  baseUrl = `${environment.apiUrl}Movimiento`;

  form: FormGroup = new FormGroup({});
  movimiento!: Movimiento;
  actionId!: number;


  constructor(private http: HttpClient, private formBuilder: FormBuilder) {
  }


  initializeFormGroup(movimiento: Movimiento| null): void {
    this.form = this.formBuilder.group({
      id: new FormControl(movimiento ? movimiento.id : ''),

      tipo: new FormControl(movimiento ? movimiento.tipo : '', [
        Validators.required,
      ]),
      monto: new FormControl(movimiento ? movimiento.monto : '', [
        Validators.required,
      ]),
      fecha: new FormControl(movimiento ? movimiento.fecha : '', [
        Validators.required,
      ]),
      descripcion: new FormControl(movimiento ? movimiento.descripcion : '', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      cuentaId: new FormControl(movimiento ? movimiento.cuentaId : ''),
      categoriaId: new FormControl(movimiento ? movimiento.categoriaId : ''),
      usuarioId: new FormControl(movimiento ? movimiento.categoriaId : ''),
      movimientoRefId: new FormControl(movimiento ? movimiento.movimientoRefId : ''),

    });
  }



  getBalance(
    filters: BalanceFilter,
  ): Observable<Balance[]> {
    const url = `${this.baseUrl}balance`;
    return this.http.post<Balance[]>(url, filters);
  }

  search(
    filters: MovimientosFilter,
  ): Observable<Movimiento[]> {
    const url = `${this.baseUrl}/search`;
    return this.http.post<Movimiento[]>(url, filters);
  }

  getAllByUserId(filter: UserFilter): Observable<any> {
    const url = `${this.baseUrl}/byUser`;
    return this.http.post<Movimiento[]>(url,filter);
  }


  getAllByAccountId(filter: CuentaFilter): Observable<any> {
    const url = `${this.baseUrl}/byAccount`;
    return this.http.post<Movimiento[]>(url,filter);
  }




  save(movimiento: Movimiento): Observable<any> {
    const url = `${this.baseUrl}`;
    return this.http.post<Movimiento>(url, movimiento);
  }
  update(movimiento: Movimiento): Observable<any> {
    const url = `${this.baseUrl}`;
    return this.http.put<Movimiento>(url, movimiento);
  }
  delete(movimientoId: string): Observable<any>{
    const url = `${this.baseUrl}`;
    return this.http.delete<any>(url, {body: {id: movimientoId} });
  }
}
