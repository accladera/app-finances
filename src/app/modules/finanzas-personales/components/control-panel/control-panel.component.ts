import {Component, OnInit, ViewChild} from '@angular/core';
import {
  GridComponent,
  PageSettingsModel, QueryCellInfoEventArgs,
  SearchSettingsModel,
  TextWrapSettingsModel,
  ToolbarItems
} from "@syncfusion/ej2-angular-grids";
import {Cuenta} from "../../interface/cuenta";
import {CuentaService} from "../../services/cuenta.service";
import {Router} from "@angular/router";
import {DialogComponent} from "../../../../components/dialog/dialog.component";
import {enumDialogType} from "../../../../enums/enumDialogType";
import {MatDialog} from "@angular/material/dialog";
import {SpinnerService} from "../../../../spinner/spinner.service";
import {setLocalization} from "../../../../helpers/LocalizationSyncFusion";
import { enumActionsAbm } from '../../../../enums/enumActionsAbm';
import {Movimiento} from "../../interface/movimiento";
import {MovimientoService} from "../../services/movimiento.service";
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn} from "@angular/forms";
import {MovimientosFilter} from "../../interface/movimientos-filter";
import {enumAlertText} from "../../../../enums/enumAlertText";
import {AlertService} from "../../../../alerts/alert.service";
import {Categoria} from "../../interface/categoria";
import {enumTypeTransaction} from "../../../../enums/enumTypeTransaction";
import {Balance} from "../../interface/balance";
import {BalanceFilter} from "../../interface/balance-filter";
import { SimpleFilter } from '../../interface/simple-filter';
import {AuthService} from "../../../../auth/services/auth.service";
import { UserFilter } from '../../interface/user-filter';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})
export class ControlPanelComponent implements OnInit {
  public dataCategorias: object[];
  public dataCuentas: object[];
  public dataMovimientos: object[];
  public dataBalance: object[];
  public dataMeses= [
    {value:1,desc:'Enero'},
    {value:2,desc:'Febrero'},
    {value:3,desc:'Marzo'},
    {value:4,desc:'Abril'},
    {value:5,desc:'Mayo'},
    {value:6,desc:'Junio'},
    {value:7,desc:'Julio'},
    {value:8,desc:'Agosto'},
    {value:9,desc:'Septiembre'},
    {value:10,desc:'Octubre'},
    {value:11,desc:'Noviembre'},
    {value:12,desc:'Diciembre'},
  ];

  // cuentas: Cuenta[] = [];
  //categorias: Categoria[] = getAllCategorias();
 // cuentas: Cuenta[] = getAllCuentas();
 // movimientos: Movimiento[] = getAllMovimientos();
 // balance: Balance[] = getAllBalance();
 categorias: Categoria[] = [];
 cuentas: Cuenta[] = [];
 movimientos: Movimiento[] = [];
 balance: Balance[] = [];

 readonly enumActionsAbm = enumActionsAbm;

  readonly enumTypeTransaction = enumTypeTransaction;

  usuarioId="";
  formCuentaRoute = '/finanzas/cuenta';
  formMovimientos = '/finanzas/movimiento';
  public locale = 'es-BO';


  //#region GridSetting

  public dateFormatTable?: object;
  public filterSettings: object;
  public pageSettings!: PageSettingsModel;
  public wrapSettings?: TextWrapSettingsModel;
  public toolbarOptions?: ToolbarItems[] | object;
  public searchOptions?: SearchSettingsModel;
  public filterType= 'Contains';
  searchFields = ['nombre'];
  @ViewChild('grid') grid!: GridComponent;

  private month: number = new Date().getMonth();
  private fullYear: number = new Date().getFullYear();
  protected start: Date | null = new Date(this.fullYear, this.month, 1);
  protected end: Date | null = new Date(this.fullYear, this.month + 1, 0);
  protected minDate: Date = new Date(2023, 1, 1);
  protected maxDate: Date = new Date(2045, 12, 31);

  //#endregion GridSetting

  public formFilterMovimientos: FormGroup = new FormGroup({});
  public formFilterBalance: FormGroup = new FormGroup({});
  private filterMovimiento: MovimientosFilter;
  private filterBalance: BalanceFilter;
  protected fieldsCuentas: object = {value: 'id', text: 'nombre'};
  protected fieldsCategorias: object = {value: 'id', text: 'nombre'};
  protected fieldsMeses: object = {value: 'value', text: 'desc'};

  protected isEmptyCuentas = true;
  protected isEmptyMovimientos = true;


  constructor(
    private router: Router,
    private dialog: MatDialog,
    private spinner: SpinnerService,
    private alert: AlertService,
    private cuentaService: CuentaService,
    private movimientoService: MovimientoService,
    private categoriaService: CategoriaService,
    private authService: AuthService,

    private formBuilder: FormBuilder,
  ) {
    this.dataCategorias = this.categorias;
    this.dataCuentas = this.cuentas;
    this.dataMovimientos = this.movimientos;
    this.dataBalance = this.balance;
    this.cuentaService.initializeFormGroup(null);
    this.locale = "es-BO";
    this.filterSettings = {type: 'Menu'};
    this.pageSettings = {pageSize: 10};
    // this.toolbarOptions = ['Search', 'ExcelExport', {
    //   text: 'Registrar nueva cuenta',
    //   tooltipText: 'Registrar nueva cuenta',
    //   prefixIcon: 'e-plus',
    //   id: 'Click',
    //   align: 'Right'
    // }];
    this.toolbarOptions = ['Search', 'ExcelExport'];
    this.searchOptions = {fields: this.searchFields, ignoreCase: true, ignoreAccent: true};
    this.dateFormatTable = {type: 'dateTime', format: 'dd/MM/yyyy'};
    this.wrapSettings = {wrapMode: 'Both'};
    this.isEmptyCuentas = true;
    this.isEmptyMovimientos = true;
    this.filterBalance={
      usuarioId: '',
      mes: new Date()
    }

    this.onInitGetUser();
    this.filterMovimiento = {
      fromDate: null,
      toDate: null,
      fechaDesde: null,
      fechaHasta: null,
      cuentaId: null,
      categoriaId: null,
      usuarioId: this.usuarioId
    }
    this.createForm();
    this.createFormBalance();
    
  }

  ngOnInit(): void {
    this.onInitGetUser();
    this.filterBalance.usuarioId= this.usuarioId;
     this.loadCuentas();
     this.loadMovimientos();
     this.loadCategorias();
     //this.loadBalance();
    setLocalization();
  }


  onInitGetUser(){
    const id = (localStorage.getItem('userId'));
    if(id){
      this.usuarioId = localStorage.getItem('userId')!;
    }
  }

  //#region AccountActions

  onCreateAccount(): void {
    this.cuentaService.actionId = enumActionsAbm.add;
    this.cuentaService.initializeFormGroup(null);
    this.router.navigateByUrl(this.formCuentaRoute);
  }

  onViewAccount(item: Cuenta): void {
    this.cuentaService.actionId = enumActionsAbm.view;
    this.cuentaService.initializeFormGroup(item);
    this.router.navigateByUrl(this.formCuentaRoute);
  }

  onDeleteAccount(item: Cuenta): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      disableClose: true,
      data: {
        title: `Eliminar cuenta`,
        description: `¿Esta Seguro de eliminar la cuenta  ${item.nombre}?`,
        type: enumDialogType.delete,
      },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res === undefined) {
        this.spinner.show();
        this.cuentaService.delete(item.id).subscribe((result: any) => {
          if (result===true) {
            this.alert.success(enumAlertText.formDeleteSuccess, enumAlertText.formTitle);
            this.cuentaService.actionId = this.enumActionsAbm.view;
            this.setFormConfiguration();
            this.spinner.hide();
            (this.grid as any)?.refresh();
          }
        });
      }
    });
  }

  //#endregion AccountActions

  setFormConfiguration(): void{
    if (!this.categoriaService.actionId) {
      this.categoriaService.actionId= enumActionsAbm.view;
    }
    this.loadCategorias();
  }




  //#region GridConfig
  clickHandlerAccountTable(args: any): void {
    // if (args.item.id === 'Click') {
    //   this.onCreateAccount();
    // }
    if (args.item.properties.id.toString().toLowerCase() === 'grid_excelexport') {
      (this.grid as any).excelExport();
    }
  }


  customizeCellMovimientos(args: QueryCellInfoEventArgs): void {
    switch ((args as any).data.tipo) {
      case enumTypeTransaction.income:
        (args as any).cell.style.color = '#07a5a1';
        break
      case enumTypeTransaction.egress:
        (args as any).cell.style.color = '#ff3a52';
        break
    }
  }
  customizeCellBalance(args: QueryCellInfoEventArgs): void {
    (args as any).cell.bgColor = '#edf2ff';
    (args as any).cell.style.fontWeight = '600';
  }


  //#endregion  GridConfig
  //#region FilterConfig
  createForm(): void {
    this.formFilterMovimientos = this.formBuilder.group({
      dateRangePicker: new FormControl([this.filterMovimiento.fromDate, this.filterMovimiento.toDate]),
      cuentaId: new FormControl(this.filterMovimiento.cuentaId),
      categoriaId: new FormControl(this.filterMovimiento.categoriaId),
    });
    this.formFilterMovimientos.controls.dateRangePicker.setValidators(this.validateFromDate());
    this.formFilterMovimientos.controls.dateRangePicker.updateValueAndValidity();
  }
  createFormBalance(): void {
    this.formFilterBalance = this.formBuilder.group({
      usuarioId: new FormControl(this.filterBalance.usuarioId),
      mes: new FormControl(this.filterBalance.mes.getMonth),
    });
  }

  validateFromDate(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value != null) {
        if (control.value.length == 2) {
          const fromDate = new Date(control.value[0]);
          const toDate = new Date(control.value[1]);
          return (fromDate >= this.minDate && toDate <= this.maxDate) ? null : {'invalidRage': {value: control.value}};
        }
      }
      return null;
    };
  }


  //#endregion FilterConfig
  //#region FilterActions
  onResetFilter(): void {
    this.formFilterMovimientos.reset();
    // this.searchPerfomed = false;
    this.dataMovimientos = [];
    this.loadMovimientos();
  }
  onResetFilterBalance(): void {
    this.formFilterBalance.controls.mes.setValue(this.month+1);
    this.formFilterBalance.controls.usuarioId.setValue(this.usuarioId);
    this.dataBalance = [];
    // this.onGetBalance();
  }

  onGetBalance(): void {
    const dataFilters = this.formFilterBalance.value;
    const year = new Date().getFullYear();
    const month = new Date().setMonth(dataFilters.month)

    this.filterBalance.mes = new Date();
    this.filterBalance.usuarioId = dataFilters.usuarioId;
    this.spinner.show();

    // this.movimientoService.getBalance(this.filterBalance)
    //   .subscribe({
    //     next: (res: any) => {
    //       if (res !== null) {
    //         this.balance = res;
    //         if (this.balance || this.balance > 0) {
    //           this.dataBalance = this.balance;
    //         }
    //       }
    //     },
    //     error: (err: any) => {
    //       this.dataBalance= [];
    //     }
    //   });
  }
  onSearch(): void {
    const dataFilters = this.formFilterMovimientos.value;
    
    this.filterMovimiento.fromDate =
      (dataFilters.dateRangePicker) ? ((dataFilters.dateRangePicker.length > 0) ?
        (dataFilters.dateRangePicker[0] >= this.minDate) ? new Date(dataFilters.dateRangePicker[0])
          : null : null) : null;
    this.filterMovimiento.toDate =
      (dataFilters.dateRangePicker) ? ((dataFilters.dateRangePicker.length > 0) ?
        (dataFilters.dateRangePicker[1] <= this.maxDate) ? new Date(dataFilters.dateRangePicker[1])
          : null : null) : null;
    this.filterMovimiento.fechaDesde =
      (this.filterMovimiento.fromDate)? this.filterMovimiento.fromDate.toDateString(): null;

      this.filterMovimiento.fechaHasta =
      (this.filterMovimiento.toDate)? this.filterMovimiento.toDate.toDateString(): null;

    this.filterMovimiento.categoriaId = (dataFilters.categoriaId) ? dataFilters.categoriaId : null;
    this.filterMovimiento.cuentaId = (dataFilters.cuentaId) ? dataFilters.cuentaId : null;
    this.filterMovimiento.usuarioId= this.usuarioId;


    if ((!this.filterMovimiento.fromDate && !this.filterMovimiento.toDate &&
      this.filterMovimiento.cuentaId === null && this.filterMovimiento.categoriaId === null)
    ) {
      this.alert.error('Configure al menos un parámetro de filtrado.', `${enumAlertText.errorTitle} de búsqueda`);
      return;
    }

    if (this.formFilterMovimientos.controls.dateRangePicker.invalid) {
      this.alert.error('El rango de fechas no es válido.', `${enumAlertText.errorTitle} de búsqueda`);
      this.filterMovimiento.fromDate = null;
      this.filterMovimiento.toDate = null;
      this.formFilterMovimientos.controls.dateRangePicker.reset();
      return;
    }
    this.start = this.filterMovimiento.fromDate;
    this.end = this.filterMovimiento.toDate;
    this.spinner.show();

    this.movimientoService.search(this.filterMovimiento)
      .subscribe({
        next: (res: any) => {
          if (res !== null) {
            this.movimientos = res;
            if (this.movimientos.length > 0) {
              this.dataMovimientos = this.movimientos;
              this.isEmptyMovimientos = false;
            } else {
              this.isEmptyMovimientos = true;
            }
          } else {
            this.isEmptyMovimientos = true;
          }
          this.spinner.hide();
        },
        error: (): void => {
          this.alert.error(enumAlertText.errorGet, enumAlertText.errorTitle);
          this.isEmptyMovimientos = true;
          this.spinner.hide();
        }
      });

  }


  //#endregion FilterActions
  //#region MovimientosActions
  onCreateMovimiento(): void {
    this.movimientoService.actionId = enumActionsAbm.add;
    this.movimientoService.initializeFormGroup(null);
    this.router.navigateByUrl(this.formMovimientos);
  }
  //#endregion MovimientosActions


  //#region LoadData

  async loadCuentas(): Promise<void> {
    const filter: UserFilter= {usuarioId: this.usuarioId} ;
    this.cuentaService.getAllByUserId(filter).subscribe({
      next: (res: any) => {
        if (res !== null) {
          this.cuentas = res;
          if (this.cuentas) {
            this.dataCuentas = this.cuentas;
          }
        }
      },
      error: (err: any) => {

        this.isEmptyMovimientos = true;

      }
    });
  }


  

  async loadMovimientos(): Promise<void> {
    const filter: UserFilter= {usuarioId: this.usuarioId} ;
    this.movimientoService.getAllByUserId(filter).subscribe({
        next: (res: any) => {
          if (res !== null) {
            this.movimientos = res;
            if (this.movimientos) {
              this.dataMovimientos = this.movimientos;
            } else {
              this.isEmptyMovimientos = true;
            }
          } else {
            this.isEmptyMovimientos = true;
          }

        },
        error: (err: any) => {
          this.isEmptyMovimientos = true;
        }
      }
    );
  }


  async loadCategorias(): Promise<void> {
    const filter: UserFilter= {usuarioId: this.usuarioId} ;
    this.categoriaService.getAllByUserId(filter).subscribe((res: any) => {
        if (res !== null) {
          this.categorias = res;
          if (this.categorias ) {
            this.dataCategorias = this.categorias;
          }
        }
      }
    );
  }

  //#endregion  LoadData

}
