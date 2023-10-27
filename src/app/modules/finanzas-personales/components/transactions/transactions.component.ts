import {Component, OnInit} from '@angular/core';
import {Categoria} from "../../interface/categoria";
import {Cuenta} from "../../interface/cuenta";
import {enumTypeTransaction} from "../../../../enums/enumTypeTransaction";
import {enumActionsAbm} from "../../../../enums/enumActionsAbm";
import {MovimientoTipo} from "../../interface/movimiento-tipo";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {SpinnerService} from "../../../../spinner/spinner.service";
import {AlertService} from "../../../../alerts/alert.service";
import {CuentaService} from "../../services/cuenta.service";
import {MovimientoService} from "../../services/movimiento.service";
import {CategoriaService} from "../../services/categoria.service";
import {enumAlertText} from "../../../../enums/enumAlertText";
import {Movimiento} from "../../interface/movimiento";
import {enableOrDisableControls} from "../../../../helpers/FormGroupUtils";
import { UserFilter } from '../../interface/user-filter';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
 
  usuarioId="";
  readonly enumTypeTransaction = enumTypeTransaction;
  readonly enumActionsAbm = enumActionsAbm;
  public movimiento: Movimiento;

  public dataCategorias: object[];
  public dataCuentas: object[];
  public dataTipos: object[];


  categorias: Categoria[] = [];
  cuentas: Cuenta[] = [];
  tiposMovimientos: MovimientoTipo[] = [{valor:0,descripcion:'Ingreso'},{valor:1, descripcion:'Egreso'}];
  protected fieldsCuentas: object = {value: 'id', text: 'nombre'};
  protected fieldsCategorias: object = {value: 'id', text: 'nombre'};
  protected fieldsTiposMovimientos: object = {value: 'valor', text: 'descripcion'};


  controlPanelRoute = '/finanzas';

  public locale = 'es-BO';
  //#region DatePickerSetting
  private month: number = new Date().getMonth();
  private fullYear: number = new Date().getFullYear();
  protected start: Date | null = new Date(this.fullYear, this.month, 1);
  protected end: Date | null = new Date(this.fullYear, this.month + 1, 0);
  protected minDate: Date = new Date(2023, 1, 1);
  protected maxDate: Date = new Date(2045, 12, 31);

  //#endregion DatePickerSetting

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private spinner: SpinnerService,
    private alert: AlertService,
    private categoriaService: CategoriaService,
    private cuentaService: CuentaService,
    public movimientoService: MovimientoService,
  ) {
    this.dataCategorias = this.categorias;
    this.dataCuentas = this.cuentas;
    this.dataTipos = this.tiposMovimientos;
    this.movimiento = this.movimientoService.form.value;
    this.locale = "es-BO";
    this.setFormConfiguration();
    this.onInitGetUser();
  }

  ngOnInit() {
    this.onInitGetUser();
    this.loadCategorias();
    this.loadCuentas();
  }

  onInitGetUser(){
    const id = (localStorage.getItem('userId'));
    if(id){
      this.usuarioId = localStorage.getItem('userId')!;
    }
  }
  onSubmit(): void {
    const objMovimiento = this.movimientoService.form.value;
    objMovimiento.usuarioId= this.usuarioId;
    if (this.movimientoService.form.invalid) {
      this.alert.warning(enumAlertText.requiredFields, enumAlertText.formTitle);
      this.movimientoService.form.markAllAsTouched();
      return
    }
    if (!this.movimientoService.form.get('id')?.value && this.movimientoService.actionId === this.enumActionsAbm.add) {
      this.movimientoService.save(objMovimiento).subscribe({
        next: (res: string): void => {
          if (res.length>0) {
              this.alert.success(enumAlertText.formSaveSuccess, enumAlertText.formTitle);
              this.movimientoService.initializeFormGroup(null);
              this.movimientoService.actionId = this.enumActionsAbm.view;
              this.setFormConfiguration();
              this.goBack();
          }
        },
        error: err => {
          this.alert.error(enumAlertText.errorSubmit, enumAlertText.formTitle);
        }
      });
    } else if (this.movimientoService.form.get('id')?.value && this.movimientoService.actionId === this.enumActionsAbm.update) {
      this.movimientoService.update(objMovimiento).subscribe({
        next: (res: any): void => {
          if (res) {
            this.movimiento = res.data;
            if (this.movimiento.id != null) {
              this.alert.success(enumAlertText.formUpdateSuccess, enumAlertText.formTitle);
              this.movimientoService.initializeFormGroup(this.movimiento);
              this.movimientoService.actionId = this.enumActionsAbm.view;
              this.setFormConfiguration();
            }
          }
        }, error: err => {
          this.alert.error(enumAlertText.errorSubmit, enumAlertText.formTitle);
        }
      });
    }

  }

  setFormConfiguration(){
    if (!this.movimientoService.actionId) {
      this.goBack();
    }
    switch (this.movimientoService.actionId) {
      case enumActionsAbm.add: {
        this.movimientoService.initializeFormGroup(null);
        enableOrDisableControls(this.movimientoService.form, true);
        break;
      }
      case enumActionsAbm.view: {
        this.movimientoService.initializeFormGroup(this.movimiento);
        enableOrDisableControls(this.movimientoService.form, false);
        break;
      }
      case enumActionsAbm.update: {
        this.movimientoService.initializeFormGroup(this.movimiento);
        enableOrDisableControls(this.movimientoService.form, true);
        break;
      }
    }

  }



  onEdit():void{
    this.movimientoService.actionId = enumActionsAbm.update;
    this.setFormConfiguration();
  }
  goBack(): void {
    this.router.navigate([this.controlPanelRoute]);
  }

  //#region  LoadData
  async loadCuentas(): Promise<void> {
    const filter: UserFilter= {usuarioId: this.usuarioId} ;
    this.cuentaService.getAllByUserId(filter).subscribe((res: any) => {
        if (res !== null) {
          this.cuentas = res;
          if (this.cuentas || this.cuentas > 0) {
            this.dataCuentas = this.cuentas;
          }
        }
      }
    );
  }

  async loadCategorias(): Promise<void> {
    const filter: UserFilter= {usuarioId: this.usuarioId} ;
    this.categoriaService.getAllByUserId(filter).subscribe((res: any) => {
        if (res !== null) {
          this.categorias = res;
          if (this.categorias || this.categorias > 0) {
            this.dataCategorias = this.categorias;
          }
        }
      }
    );
  }

  //#endregion  LoadData


}
