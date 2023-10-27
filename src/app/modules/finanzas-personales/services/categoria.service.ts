import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Categoria} from "../interface/categoria";
import {HttpClient} from "@angular/common/http";
import { Observable, filter } from 'rxjs';
import { SimpleFilter } from '../interface/simple-filter';
import { UserFilter } from '../interface/user-filter';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  baseUrl = `${environment.apiUrl}Categoria`;

  form: FormGroup = new FormGroup({});
  categoria!: Categoria;
  actionId!: number;
  constructor(private http: HttpClient, private formBuilder: FormBuilder) {
  }


  initializeFormGroup(categoria: any): void {
    this.form = this.formBuilder.group({
      id: new FormControl(categoria ? categoria.id : ''),
      propietarioId: new FormControl(categoria ? categoria.propietarioId : null),
      nombre: new FormControl(categoria ? categoria.nombre : '', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
    });
  }
  getAllByUserId(filter: UserFilter): Observable<any> {
    const url = `${this.baseUrl}/byUser`;
    return this.http.post<Categoria[]>(url,filter);
  }

  save(categoria: Categoria): Observable<any> {
    const url = `${this.baseUrl}`;
    return this.http.post<Categoria>(url, categoria);
  }

  update(categoria: Categoria): Observable<any> {
    const url = `${this.baseUrl}`;
    return this.http.put<Categoria>(url, categoria);
  }

  delete(categoriaId: string): Observable<any>{
    const url = `${this.baseUrl}`;
    return this.http.delete<any>(url, {body: {id: categoriaId} });
  }

}
