import {Component, ViewChild} from '@angular/core';
import {Cuenta} from "../../interface/cuenta";
import {
  GridComponent,
  PageSettingsModel, QueryCellInfoEventArgs,
  SearchSettingsModel,
  TextWrapSettingsModel,
  ToolbarItems
} from "@syncfusion/ej2-angular-grids";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {SpinnerService} from "../../../../spinner/spinner.service";
import {CuentaService} from "../../services/cuenta.service";
import {DialogComponent} from "../../../../components/dialog/dialog.component";
import {enumDialogType} from "../../../../enums/enumDialogType";
import {setLocalization} from "../../../../helpers/LocalizationSyncFusion";
import {MovimientoService} from "../../services/movimiento.service";
import {Movimiento} from "../../interface/movimiento";
import {TextBoxComponent} from "@syncfusion/ej2-angular-inputs";
import {enumActionsAbm} from "../../../../enums/enumActionsAbm";
import {enableOrDisableControls} from "../../../../helpers/FormGroupUtils";
import {enumTypeTransaction} from "../../../../enums/enumTypeTransaction";
import {enumAlertText} from "../../../../enums/enumAlertText";
import {AlertService} from "../../../../alerts/alert.service";
import { CuentaFilter } from '../../interface/cuenta-filter';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  @ViewChild('name')
  inputName!: TextBoxComponent;
  maxLenghtName = '0/100';

  public data: object[];
  movimientos: Movimiento[]=[];

  cuenta: Cuenta;
  private  usuarioId="";
  readonly enumActionsAbm = enumActionsAbm;
  readonly enumTypeTransaction = enumTypeTransaction;


  controlPanelRoute = '/finanzas';
  formCuentaRoute = '/finanzas/cuenta';
  formMovimientoRoute = '/finanzas/movimiento';
  public locale = 'es-BO';
  width = '75%';
  public dateFormatTable?: object;
  public filterSettings: object;
  public pageSettings!: PageSettingsModel;
  public wrapSettings?: TextWrapSettingsModel;
  public toolbarOptions?: ToolbarItems[] | object;
  public searchOptions?: SearchSettingsModel;
  searchFields = ['categoria'];
  @ViewChild('grid') grid!: GridComponent;










  constructor(
    private router: Router,
    private dialog: MatDialog,
    private spinner: SpinnerService,
    private alert: AlertService,
    public cuentaService: CuentaService,
    private movimientoService: MovimientoService,
  ) {
    this.data = this.movimientos;
    this.cuenta = this.cuentaService.form.value;

    this.filterSettings = { type: 'Menu' };
    this.pageSettings = { pageSize: 10 };
    this.toolbarOptions = ['Search'];
    this.searchOptions = { fields: this.searchFields, ignoreCase: true, ignoreAccent: true };
    
    this.pageSettings = {pageSize: 5};
    this.onInitGetUser();
  }

  ngOnInit(): void {
    
    this.onInitGetUser();
    this.setFormConfiguration();
    setLocalization();
  }
  onInitGetUser(){
    const id = (localStorage.getItem('userId'));
    if(id){
      this.usuarioId = localStorage.getItem('userId')!;
    }
  }

  setFormConfiguration(): void {
    if (!this.cuentaService.actionId) {
       this.goBack();
    }
    switch (this.cuentaService.actionId) {
      case enumActionsAbm.add: {
        this.cuentaService.initializeFormGroup(null);
        
        enableOrDisableControls(this.cuentaService.form, true);
        break;
      }
      case enumActionsAbm.view: {
        this.cuentaService.initializeFormGroup(this.cuenta);
        enableOrDisableControls(this.cuentaService.form, false);
        this.loadMovimientos();

        break;
      }
      case enumActionsAbm.update: {
        this.cuentaService.initializeFormGroup(this.cuenta);
        enableOrDisableControls(this.cuentaService.form, true);
        this.loadMovimientos();

        break;
      }
    }

  }


  goBack(): void {
    this.router.navigate([this.controlPanelRoute]);
  }





  //#endregion CuentaFormConfig
  //#region CuentaActions
  onSubmit(): void {
    const objCuenta = this.cuentaService.form.value;
    objCuenta.propietarioId =this.usuarioId;
    if (this.cuentaService.form.invalid) {
      this.alert.warning(enumAlertText.requiredFields, enumAlertText.formTitle);
      this.cuentaService.form.markAllAsTouched();
      return
    }
    if (!this.cuentaService.form.get('id')?.value && this.cuentaService.actionId === this.enumActionsAbm.add) {
      this.cuentaService.save(objCuenta).subscribe({
        next: (res: string): void => {
          if (res.length>0) {
         this.alert.success(enumAlertText.formSaveSuccess, enumAlertText.formTitle);
              this.cuentaService.initializeFormGroup(null);
              this.cuentaService.actionId = this.enumActionsAbm.view;
              this.setFormConfiguration();
              this.goBack();
          }
        },
        error: err => {
          this.alert.error(enumAlertText.errorSubmit, enumAlertText.formTitle);
        }
      });
    } else if (this.cuentaService.form.get('id')?.value && this.cuentaService.actionId === this.enumActionsAbm.update) {
      this.cuentaService.update(objCuenta).subscribe({
        next: (res: string): void => {
            if(res.length>0){
              this.alert.success(enumAlertText.formUpdateSuccess, enumAlertText.formTitle);
              //this.cuentaService.initializeFormGroup(this.cuenta);
              this.cuentaService.actionId = this.enumActionsAbm.view;
              this.setFormConfiguration();
            }
          
        }, error: err => {
          this.alert.error(enumAlertText.errorSubmit, enumAlertText.formTitle);
        }
      });
    }
  }

  onCancelEdition() {
    this.cuentaService.actionId = enumActionsAbm.view;
    this.setFormConfiguration();
  }

  onEdit() {
    this.cuentaService.actionId = enumActionsAbm.update;
    this.setFormConfiguration();
  }


  //#endregion CuentaActions
  //#region MovimientoActions
  onCreate(): void {
    this.movimientoService.initializeFormGroup(null);
    this.router.navigateByUrl(this.formMovimientoRoute);
  }

  onView(item: Movimiento): void {
    this.movimientoService.initializeFormGroup(item);
    this.movimientoService.actionId= this.enumActionsAbm.view;
    this.router.navigateByUrl(this.formMovimientoRoute);
  }

  onDelete(item: Movimiento): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      disableClose: true,
      data: {
        title: `Eliminar registro:`,
        description: `¿Está seguro de eliminar el movimiento?`,
        type: enumDialogType.delete,
      },
    });
    dialogRef.afterClosed().subscribe({ 
      next:(res: any) => {
      if (res === undefined) {
        this.spinner.show();
        this.movimientoService.delete(item.id).subscribe(
          {
              next: (res: any): void => {
                if (res == true) {
                  this.spinner.hide();
                  this.alert.success('Se elimino correctamente','');
                }else{
                  if (this.cuenta.id != null) {
                    this.alert.error(enumAlertText.errorSubmit, '');
                   }
                }
              }, error: err => {
                this.alert.error(enumAlertText.errorSubmit, enumAlertText.formTitle);
              }
            });
          }
          
        },
         error: err => {
          this.alert.error(enumAlertText.errorSubmit, enumAlertText.formTitle);
        }          
      });
     }
          
          

  //#endregion MovimientoActions

  //#region  GridConfig
  clickHandler(args: any): void {
    if (args.item.id === 'Click') {
      this.onCreate();
    }
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

  //#endregion  GridConfig
  //#region  LoadData
  async loadMovimientos(): Promise<void> {
    const filter: CuentaFilter= {cuentaId: this.cuenta.id} ;
    this.movimientoService.getAllByAccountId(filter).subscribe((res: any) => {
        if (res !== null) {
          this.movimientos = res;
          if (this.movimientos || this.movimientos > 0) {
            this.data = this.movimientos;
          }
        }
      }
    );
  }

  //#endregion  LoadData

}
