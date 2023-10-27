import {Component, OnInit, ViewChild} from '@angular/core';
import {TextBoxComponent} from "@syncfusion/ej2-angular-inputs";
import {Categoria} from "../../interface/categoria";
import {
  GridComponent,
  PageSettingsModel,
  SearchSettingsModel,
  TextWrapSettingsModel,
  ToolbarItems
} from "@syncfusion/ej2-angular-grids";
import {enumActionsAbm} from "../../../../enums/enumActionsAbm";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {SpinnerService} from "../../../../spinner/spinner.service";
import {setLocalization} from "../../../../helpers/LocalizationSyncFusion";
import { CategoriaService } from '../../services/categoria.service';
import {DialogComponent} from "../../../../components/dialog/dialog.component";
import {enumDialogType} from "../../../../enums/enumDialogType";
import {AlertService} from "../../../../alerts/alert.service";
import {enumAlertText} from "../../../../enums/enumAlertText";
import {enableOrDisableControls} from "../../../../helpers/FormGroupUtils";
import { UserFilter } from '../../interface/user-filter';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {


  @ViewChild('name')
  private inputName!: TextBoxComponent;
  public maxLenghtName = '0/100';
  public isFormActive = false;


  public data: object[];
  private categorias: Categoria[] = [];
  private categoria: Categoria;
  private  usuarioId="";

  readonly enumActionsAbm = enumActionsAbm;
  private controlPanelRoute = '/finanzas';

  public locale = 'es-BO';
  public dateFormatTable?: object;
  public filterSettings: object;
  public pageSettings!: PageSettingsModel;
  public wrapSettings?: TextWrapSettingsModel;
  public toolbarOptions?: ToolbarItems[] | object;
  public searchOptions?: SearchSettingsModel;
  private searchFields = ['nombre'];
  @ViewChild('grid')
  private grid!: GridComponent;


  constructor(
    private router: Router,
    private dialog: MatDialog,
    private spinner: SpinnerService,
    private alert: AlertService,

    public categoriaService: CategoriaService,
  ) {
    this.data = this.categorias;
    this.categoria = this.categoriaService.form.value;
    this.filterSettings = {type: 'Menu'};
    this.pageSettings = {pageSize: 5};
    this.categoriaService.initializeFormGroup(null);
    this.filterSettings = {type: 'Menu'};
    this.toolbarOptions = ['Search'];
    this.searchOptions = {fields: this.searchFields, ignoreCase: true, ignoreAccent: true};
    this.dateFormatTable = {type: 'dateTime', format: 'dd/MM/yyyy'};
    this.wrapSettings = {wrapMode: 'Both'};
    this.isFormActive = false;
    this.onInitGetUser();

  }

  ngOnInit(): void {
   
    this.onInitGetUser();
    this.setInputCounterValue();
    this.setFormConfiguration();
   
    // this.setFormConfiguration();
    setLocalization();
  }

  onInitGetUser(){
    const id = (localStorage.getItem('userId'));
    if(id){
      this.usuarioId = localStorage.getItem('userId')!;
    }
  }

  onSubmit(): void {
    const objCategoria = this.categoriaService.form.value;
    objCategoria.propietarioId= this.usuarioId;
    if (this.categoriaService.form.invalid) {
      this.alert.warning(enumAlertText.requiredFields, enumAlertText.formTitle);
      this.categoriaService.form.markAllAsTouched();
      return
    }
    if (!this.categoriaService.form.get('id')?.value && this.categoriaService.actionId === this.enumActionsAbm.add) {
      this.categoriaService.save(objCategoria).subscribe({
        next: (res: string): void => {
          if (res.length>0) {
              this.alert.success(enumAlertText.formSaveSuccess, enumAlertText.formTitle);
              this.categoriaService.actionId = this.enumActionsAbm.view;
              this.setFormConfiguration();
          }else{
            this.spinner.hide();
            this.alert.error(enumAlertText.errorSubmit, enumAlertText.formTitle);
          }
        },
        error: err => {
          this.spinner.hide();
          this.alert.error(enumAlertText.errorSubmit, enumAlertText.formTitle);
        }
      });
    } else if (this.categoriaService.form.get('id')?.value && this.categoriaService.actionId === this.enumActionsAbm.update) {
      this.categoriaService.update(objCategoria).subscribe({
        next: (res: any): void => {
          if (res.length>0) {
            this.spinner.hide();
              this.alert.success(enumAlertText.formUpdateSuccess, enumAlertText.formTitle);
              this.categoriaService.actionId = this.enumActionsAbm.view;
              this.setFormConfiguration();
          }else{
            this.spinner.hide();
            this.alert.error(enumAlertText.errorSubmit, enumAlertText.formTitle);
          }
        }, error: err => {
          this.spinner.hide();
          this.alert.error(enumAlertText.errorSubmit, enumAlertText.formTitle);
        }
      });
    }
  }


  onCreate(): void {
    this.categoriaService.initializeFormGroup(null);
    this.categoriaService.actionId = enumActionsAbm.add;
    this.isFormActive = true;
  }

  onEdit(item: Categoria): void {
    this.categoriaService.initializeFormGroup(item);
    this.categoriaService.actionId = enumActionsAbm.update;
    this.isFormActive = true;
  }


  onDelete(item: Categoria): void {
    
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '500px',
        disableClose: true,
        data: {
          title: `Eliminar movimiento`,
          description: `¿Está seguro de eliminar la categoría ${item.nombre}?`,
          type: enumDialogType.delete,
        },
      });
      dialogRef.afterClosed().subscribe((res: any) => {
        if (res === undefined) {
          this.spinner.show();
            this.categoriaService.delete(item.id).subscribe((res: any) => {
                if (res) {
                  this.spinner.hide();
                    this.alert.success(enumAlertText.formDeleteSuccess, enumAlertText.formTitle);
                    this.categoriaService.actionId = this.enumActionsAbm.view;
                    this.setFormConfiguration();
                }else{
                this.spinner.hide();
                this.alert.error('No se pudo eliminar la categoría','');
                }}        
            );       
        }  } );
      }


  goBack(): void {
    this.router.navigate([this.controlPanelRoute]);
  }

  setFormConfiguration(): void{
    if (!this.categoriaService.actionId) {
      this.categoriaService.actionId= enumActionsAbm.view;
    }
    switch (this.categoriaService.actionId) {
      case enumActionsAbm.add: {
        this.categoriaService.initializeFormGroup(null);

        this.isFormActive =true;
        enableOrDisableControls(this.categoriaService.form, true);
        break;
      }
      case enumActionsAbm.view: {
        this.categoriaService.initializeFormGroup(this.categoria);
        this.isFormActive =false;
        enableOrDisableControls(this.categoriaService.form, false);
        break;
      }
      case enumActionsAbm.update: {
        this.categoriaService.initializeFormGroup(this.categoria);
        this.isFormActive =true;
        enableOrDisableControls(this.categoriaService.form, true);
        break;
      }
    }
    this.loadCategorias();
  }
  setInputCounterValue(): void {
    if (this.categoriaService.actionId === enumActionsAbm.update) {
      this.maxLenghtName = (this.categoria.nombre) ? `${this.categoria.nombre.length}/100` : '0/100';
    }
  }


  public inputHandlerName(): void {
    this.maxLenghtName = this.inputName.element.value.length + '/100';
  }
  async loadCategorias(): Promise<void> {
    const filter: UserFilter= {usuarioId: this.usuarioId} ;
    this.categoriaService.getAllByUserId(filter).subscribe((res: any) => {
        if (res !== null) {
          this.categorias = res;
          if (this.categorias || this.categorias > 0) {
            this.data = this.categorias;
          //  (this.grid as any)?.refresh();
          }
        }
      }
    );
  }


}
